import { MAX_RUNNER_SPEED, NETWORK_OUTPUTS } from '../constants'
import { Game } from '../game/game'
import { Application, Assets, Container, Graphics } from 'pixi.js'
import { Textures } from '../types'
import { ActivationLayers, Input, NeuralNetwork, Output, WeightLayers } from '../neuralNetwork/network'
import { networkManager } from '../neuralNetwork/networkManager'

class Env {

    contextMenu = document.getElementById('contextMenu')

    games: {[ID: string]: Game } = {}
    graphSize = 20
    graphLength = this.graphSize * this.graphSize
    posSize = 8
    IDIndex = 0
    width = this.graphSize * this.posSize
    height = this.graphSize * this.posSize
    lastFrameTime = new Date().getTime()
    lastUpdateTime = new Date().getTime()
    app = new Application({ 
        backgroundAlpha: 0,
        /* antialias: true, */
        width: this.width, 
        height: this.height,
    })
    foreground = new Container()
    background = new Container()
    graphics = new Graphics()

    settings = {
        networkVisuals: false,
        enableRender: true,
    }

    stats = {
        tick: 0,
        fps: '0',
        ups: '0',
        roundTick: 0,
        speed: 1,
        bestCells: 0,
        bestScore: 0,
        organisms: 0,
        organismsQuota: 50,
        games: 1,
        roundTickLimit: 250,
        lastReset: 0,
    }

    textures: Textures

    constructor() {


    }
    async init() {

        await this.initSprites()
        this.initApp()
        this.initContainer()
        this.initGraphics()
        networkManager.init()
        this.initNetworks()
        this.initGames()
        env.app.stage.children.sort((a, b) => a.zIndex - b.zIndex)

        this.app.ticker.add(this.runFPS)
    }

    private async initSprites() {

        this.textures = {
            'cellMembrane': await Assets.load('sprites/cellMembrane.png'),
            'solarCell': await Assets.load('sprites/solarCell.png'),
            'collectorCell': await Assets.load('sprites/collectorCell.png'),
            'attackerCell': await Assets.load('sprites/attackerCell.png'),
            'gridPos': await Assets.load('sprites/grass.png'),
        }
    }

    private initApp() {

        const view = this.app.view as unknown as HTMLElement

        view.classList.add('env')
        view.id = 'env'
        document.getElementById('envParent').appendChild(view)

        this.app.stage.eventMode = 'dynamic'
    }

    private initContainer() {

        this.foreground.zIndex = 2
        this.app.stage.addChild(this.foreground)

        this.background.zIndex = 0
        this.app.stage.addChild(this.background)
    }
    
    private initGraphics() {

        this.graphics.zIndex = 1
        this.foreground.addChild(this.graphics)
    }

    private initGames() {
    
        //

        for (let i = 0; i < this.stats.games; i++) {
    
            const game = new Game()
            game.init()
        }
    }

    private findInputs() {

        const inputs  = [
            // General
            new Input('Last energy', [0], ['-1']),
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

        return inputs
    }

    private initNetworks() {

        const inputs = this.findInputs()

        for (let i = Object.keys(networkManager.networks).length; i < this.stats.organismsQuota; i++) {

            const network = new NeuralNetwork()
            network.init(inputs, NETWORK_OUTPUTS.length)
            network.mutate()
            if (env.settings.networkVisuals) network.createVisuals(inputs, NETWORK_OUTPUTS)
        }
    }

    private cloneNetworks(network: NeuralNetwork) {

        const inputs = this.findInputs()
        
        for (let i = Object.keys(networkManager.networks).length; i < this.stats.organismsQuota; i++) {

            const newNetwork = network.clone()
            newNetwork.mutate()
            if (env.settings.networkVisuals) newNetwork.createVisuals(inputs, NETWORK_OUTPUTS)
        }
    }
    
    newID() {
    
        this.IDIndex += 1
        return this.IDIndex.toString()
    }

    private runFPS() {
        if (!env.settings.enableRender) return
        
        if (env.lastUpdateTime <= env.lastFrameTime) {

            return
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
        /* console.log('tick', this.stats.tick) */
        let runningGames = 0

        env.graphics.clear()

        this.stats.organisms = 0
        this.stats.bestCells = 0

        const winners: Set<string> = new Set()
    
        for (const gameID in this.games) {
    
            const game = this.games[gameID]
            if (!game.running) {

                winners.add(game.winner)
                continue
            }

            runningGames += 1
            game.run()
        }
    
        for (const statName in this.stats) {
    
            document.getElementById(statName).innerText = this.stats[statName as keyof typeof this.stats].toString()
        }
    
        //
    
        if (!runningGames) {
    
            this.reset(winners)
        }

        const thisUpdateTime = new Date().getTime()
        this.stats.ups = (MAX_RUNNER_SPEED / (thisUpdateTime - this.lastUpdateTime)).toFixed(2)
        this.lastUpdateTime = new Date().getTime()
    }

    manualReset() {

        for (const ID in this.games) {

            const game = this.games[ID]

            game.stop()
        }

        this.reset()
    }
    
    reset(winners: Set<string> = new Set()) {
    
        this.stats.lastReset = this.stats.tick
        this.stats.roundTick = 0

        for (const ID in networkManager.networks) {

            if (winners.has(ID)) continue

            delete networkManager.networks[ID]
        }

        const winnerID = Array.from(winners)[0]
        if (winnerID) {

            const winner = networkManager.networks[winnerID]
            this.cloneNetworks(winner)
        }
        else this.initNetworks()
    
        for (const gameID in this.games) {
    
            const game = this.games[gameID]
    
            game.reset()
        }
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

    toggleRender() {

        env.settings.enableRender = !env.settings.enableRender
    }

    toggleNetworkVisuals() {
        env.settings.networkVisuals = !env.settings.networkVisuals
    }

    changeSpeed() {

        const element = document.getElementById('newSpeed') as HTMLInputElement
        if (!element.value) return

        env.stats.speed = parseInt(element.value)
    }

    changeGames() {

        const element = document.getElementById('newGames') as HTMLInputElement
        if (!element.value) return

        env.stats.games = parseInt(element.value)
    }

    changeOrganisms() {

        const element = document.getElementById('newOrganisms') as HTMLInputElement
        if (!element.value) return

        env.stats.organismsQuota = parseInt(element.value)
    }

    changeRoundTickLimit() {

        const element = document.getElementById('newRoundTickLimit') as HTMLInputElement
        if (!element.value) return

        env.stats.roundTickLimit = parseInt(element.value)
    }
}

export const env = new Env()