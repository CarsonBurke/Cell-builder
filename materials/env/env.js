

class Env {
    app
    graphics
    gamesAmount = 1
    contextMenu = document.getElementById('contextMenu')

    constructor() {

        this.games = {}
        this.graphSize = 20
        this.graphLength = this.graphSize * this.graphSize
        this.coordSize = 64
        this.searchCount = 1
        this.generationsQuota = 100
        this.IDIndex = 0
        this.width = this.graphSize * this.coordSize
        this.height = this.graphSize * this.coordSize
        this.lastReset = 0
        this.lastFrameTime = new Date()
        this.lastUpdateTime = new Date()

        this.tick = 0
        this.fps = '0'
        this.ups = '0'
        this.roundTick = 0
        this.speed = 1
        this.bestTotalScore = 0
        this.bestGenScore = 0

        this.stats = [
            'tick',
            'roundTick',
            'speed',
            'fps',
            'ups',
            'bestTotalScore',
            'bestGenScore',
        ]
    }
    init() {

        this.initApp()
        this.initContainer()
        this.initGraphics()
        this.initGames()
    }

    initApp() {

        this.app = new PIXI.Application({ 
            backgroundAlpha: 0,
            /* antialias: true, */
            width: this.width, 
            height: this.height,
        })
        this.app.view.classList.add('env')
        this.app.view.id = 'env'
        document.getElementById('envParent').appendChild(this.app.view)

        this.app.autoDensity = true
        this.app.stage.eventMode = 'dynamic'
    }

    initContainer() {

        this.container = new PIXI.Container()
        this.app.stage.addChild(this.container)
    }
    
    initGraphics() {

        this.graphics = new PIXI.Graphics()
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
    
        return this.IDIndex++
    }

    runFPS() {

        this.fps += 1
    
        for (const gameID in this.games) {
    
            const game = this.games[gameID]
    
        }
    
        for (const statType of this.stats) {
    
            document.getElementById(statType).innerText = this[statType]
        }

        const thisFrameTime = new Date()
        this.fps = (MAX_RUNNER_SPEED / (thisFrameTime - this.lastFrameTime)).toFixed(2)
        this.lastFrameTime = new Date()
    }

    runUPS() {
        
        this.tick += 1
        this.roundTick += 1
    
        let runningGames = 0
    
        for (const gameID in this.games) {
    
            const game = this.games[gameID]
            if (game.running) runningGames += 1
    
            game.run()
        }
    
        for (const statType of this.stats) {
    
            document.getElementById(statType).innerText = this[statType]
        }
    
        //
    
        if (!runningGames) {
    
            this.reset()
        }

        const thisUpdateTime = new Date()
        this.ups = (MAX_RUNNER_SPEED / (thisUpdateTime - this.lastUpdateTime)).toFixed(2)
        this.lastUpdateTime = new Date()
    }
    
    reset() {
    
        this.lastReset = this.tick
        this.roundTick = 0
        this.generation += 1
    
        for (const gameID in this.games) {
    
            const game = this.games[gameID]
    
            game.reset()
            game.init()
        }

        this.container.destroy()
        this.initContainer()
    }

    keyManager(event) {


    }

    clickManager(event) {

        const targetEl = event.target
        console.log(targetEl)
        if (targetEl.classList.contains('contextMenuPart')) {

            return
        }

        this.contextMenu.classList.add('spaceHidden')
    }

    onContextMenu(event) {

        event.preventDefault()

        console.log(event.clientX, event.clientY, document.body.getBoundingClientRect().top)

        this.contextMenu.classList.remove('spaceHidden')
        this.contextMenu.style.top = event.clientY + Math.abs(document.body.getBoundingClientRect().top) + 'px'
        this.contextMenu.style.left = event.clientX + 'px'
    }
}

const env = new Env()