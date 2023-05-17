import { MAX_RUNNER_SPEED } from '../constants.js'
import { Game } from '../game/game.js'
import { Application, Container, Graphics } from 'pixi.js'

class Env {

    gamesAmount = 1
    speed = 1
    contextMenu = document.getElementById('contextMenu')

    games: {[ID: string]: Game } = {}
    graphSize = 50
    graphLength = this.graphSize * this.graphSize
    posSize = 64
    IDIndex = 0
    width = this.graphSize * this.posSize
    height = this.graphSize * this.posSize
    lastReset = 0
    lastFrameTime = new Date()
    lastUpdateTime = new Date()
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
        bestTotalScore: 0,
        bestGenScore: 0
    }

    constructor() {


    }
    init() {

        this.initApp()
        this.initContainer()
        this.initGraphics()
        this.initGames()
    }

    initApp() {

        
        this.app.view.classList.add('env')
        this.app.view.id = 'env'
        document.getElementById('envParent').appendChild(this.app.view)

        this.app.stage.eventMode = 'dynamic'
    }

    initContainer() {

        
        this.app.stage.addChild(this.container)
    }
    
    initGraphics() {

        this.container.addChild(this.graphics)
    }

    initGames() {
    
        //
    
        for (let i = 0; i < this.gamesAmount; i++) {
    
            const game = new Game()
            game.init()
        }
    }
    
    newID() {
    
        this.IDIndex += 1
        return this.IDIndex.toString()
    }

    runFPS() {

        this.stats.fps += 1
    
        for (const gameID in this.games) {
    
            const game = this.games[gameID]
    
        }
    
        for (const statName in this.stats) {
    
            document.getElementById(statName).innerText = this.stats[statName as keyof typeof this.stats].toString()
        }

        const thisFrameTime = new Date()
        this.stats.fps = (MAX_RUNNER_SPEED / (thisFrameTime.getTime() - this.lastFrameTime.getTime())).toFixed(2)
        this.lastFrameTime = new Date()
    }

    runUPS() {
        
        this.stats.tick += 1
        this.stats.roundTick += 1
    
        let runningGames = 0
    
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

        const thisUpdateTime = new Date()
        this.stats.ups = (MAX_RUNNER_SPEED / (thisUpdateTime.getTime() - this.lastUpdateTime.getTime())).toFixed(2)
        this.lastUpdateTime = new Date()
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

        const targetEl = event.target as HTMLElement
        if (targetEl.classList.contains('contextMenuPart')) {

            return
        }

        this.contextMenu.classList.add('spaceHidden')
    }

    onContextMenu(event: Event) {

        event.preventDefault()

        this.contextMenu.classList.remove('spaceHidden')
        this.contextMenu.style.top = (event as any).clientY + Math.abs(document.body.getBoundingClientRect().top) + 'px'
        this.contextMenu.style.left = (event as any).clientX + 'px'
    }
}

export const env = new Env()