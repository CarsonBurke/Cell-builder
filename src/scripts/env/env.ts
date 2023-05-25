import { MAX_RUNNER_SPEED, NETWORK_OUTPUTS } from '../constants'
import { Game } from '../game/game'
import { Application, Assets, Container, Graphics } from 'pixi.js'
import { Textures } from '../types'
import { Input, NeuralNetwork, Output } from '../neuralNetwork/network'
import { networkManager } from '../neuralNetwork/networkManager'

class Env {

    gamesQuota = 1
    organismsQuota = 1
    contextMenu = document.getElementById('contextMenu')

    games: {[ID: string]: Game } = {}
    graphSize = 12
    graphLength = this.graphSize * this.graphSize
    posSize = 8
    IDIndex = 0
    width = this.graphSize * this.posSize
    height = this.graphSize * this.posSize
    lastReset = 0
    lastFrameTime = new Date().getTime()
    lastUpdateTime = new Date().getTime()
    app = new Application({ 
        backgroundAlpha: 0,
        /* antialias: true, */
        width: this.width, 
        height: this.height,
    }) as any
    container = new Container()
    graphics = new Graphics()

    stats = {
        tick: 0,
        fps: '0',
        ups: '0',
        roundTick: 0,
        speed: 1,
        bestCells: 0,
        organisms: 0,
    }

    sprites: Textures

    constructor() {


    }
    async init() {

        await this.initSprites()
        this.initApp()
        this.initContainer()
        this.initGraphics()
        this.initNetworks()
        this.initGames()

        this.app.ticker.add(this.runFPS)
    }

    private async initSprites() {

        this.sprites = {
            'cellMembrane': await Assets.load('sprites/cellMembrane.png'),
            'solarCell': await Assets.load('sprites/solarCell.png'),
            'collectorCell': await Assets.load('sprites/collectorCell.png'),
            'attackerCell': await Assets.load('sprites/attackerCell.png'),
        }
    }

    private initApp() {

        this.app.view.classList.add('env')
        this.app.view.id = 'env'
        document.getElementById('envParent').appendChild(this.app.view)

        this.app.stage.eventMode = 'dynamic'
    }

    private initContainer() {

        this.app.stage.addChild(this.container)
    }
    
    private initGraphics() {

        this.graphics.zIndex = 1
        this.container.addChild(this.graphics)
    }

    private initGames() {
    
        //

        for (let i = 0; i < this.gamesQuota; i++) {
    
            const game = new Game()
            game.init()
        }
    }

    private initNetworks() {

        networkManager.init()

        const inputs  = [
            // General
            new Input('Runs left', [0], ['0']),
            new Input('Income', [0], ['1']),
            new Input('Energy', [0], ['2']),
        ]

        // Cells and positions

        for (let x = 0; x < env.graphSize; x += 1) {
            for (let y = 0; y < env.graphSize; y += 1) {

                inputs.push(
                    new Input(x + ', ' + y, [
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                    ], 
                    [
                        '3',
                        '4',
                        '5',
                        '6',
                        '7',
                        '8',
                        '9',
                        '10',
                        '11',
                    ])
                )
            }
        } 

        for (let i = 0; i < 1; i++) {

            const network = new NeuralNetwork()
            network.init(inputs, NETWORK_OUTPUTS.length)
            network.mutate()
            network.createVisuals(inputs, NETWORK_OUTPUTS)
        }
    }
    
    newID() {
    
        this.IDIndex += 1
        return this.IDIndex.toString()
    }

    private runFPS() {
        
        if (env.lastUpdateTime <= env.lastFrameTime) {

            return
        }

        env.container.children.sort((a, b) => a.zIndex - b.zIndex)
    
        for (const gameID in env.games) {
    
            const game = env.games[gameID]
    
        }
    
        for (const statName in env.stats) {
    
            document.getElementById(statName).innerText = env.stats[statName as keyof typeof env.stats].toString()
        }

        const thisFrameTime = new Date().getTime()
        env.stats.fps = (MAX_RUNNER_SPEED / (thisFrameTime - env.lastFrameTime)).toFixed(2)
        env.lastFrameTime = new Date().getTime()
    }

    async runUPS() {

        this.stats.tick += 1
        this.stats.roundTick += 1
        console.log('tick', this.stats.tick)
        let runningGames = 0

        env.graphics.clear()

        this.stats.organisms = 0
        this.stats.bestCells = 0
    
        for (const gameID in this.games) {
    
            const game = this.games[gameID]
            if (game.running) runningGames += 1
    
            game.run()
        }
    
        for (const statName in this.stats) {
    
            document.getElementById(statName).innerText = this.stats[statName as keyof typeof this.stats].toString()
        }
    
        //
    
        if (!runningGames) {
    
            this.reset()
        }

        const thisUpdateTime = new Date().getTime()
        this.stats.ups = (MAX_RUNNER_SPEED / (thisUpdateTime - this.lastUpdateTime)).toFixed(2)
        this.lastUpdateTime = new Date().getTime()
    }
    
    reset() {
    
        this.lastReset = this.stats.tick
        this.stats.roundTick = 0
    
        for (const gameID in this.games) {
    
            const game = this.games[gameID]
    
            game.reset()
            game.init()
        }

        this.container.destroy()
        this.initContainer()
    }

    keyManager(event: Event) {


    }

    clickManager(event: Event) {
        return

        const targetEl = event.target as HTMLElement
        if (targetEl.classList.contains('contextMenuPart')) {

            return
        }

        this.contextMenu.classList.add('spaceHidden')
    }

    onContextMenu(event: Event) {
        return

        event.preventDefault()

        this.contextMenu.classList.remove('spaceHidden')
        this.contextMenu.style.top = (event as any).clientY + Math.abs(document.body.getBoundingClientRect().top) + 'px'
        this.contextMenu.style.left = (event as any).clientX + 'px'
    }
}

export const env = new Env()