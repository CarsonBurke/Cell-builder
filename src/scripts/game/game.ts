import { CellTypes, CELL_TYPES, MAX_RUNNER_SPEED } from "../constants"
import { env } from "../env/env"
import { AttackerCell } from "./attackerCell"
import { Cell } from "./cell"
import { CellMembrane } from "./cellMembrane"
import { CollectorCell } from "./collectorCell"
import { findHighestIndexOfScore, findHighestScoreOfKeys, packPos, packXY, randomChance, roundFloat } from "./gameUtils"
import { GridPos } from "./gridPos"
import { Organism } from "./organism"
import { SolarCell } from "./solarCell"
import { Cells } from "../types"
import { networkManager } from "../neuralNetwork/networkManager"
import { randomPos } from "../../utils"
import { Application, Container, Graphics } from "pixi.js"
import GameStat, { initStats } from "../../components/gameStat"

export class Game {
    ID = env.newID()
    running = false
    graph: GridPos[]
    organisms: {[ID: string]: Organism}
    cells: Cells
    cellGraph: Cell[]
    /**
     * The ID of the network for the organism that won
     */
    winner: string
    organismsCount: number
    enableRender: boolean
    app = new Application({ 
        backgroundAlpha: 0,
        /* antialias: true, */
        width: env.width, 
        height: env.height,
    })
    foreground = new Container()
    background = new Container()
    graphics = new Graphics()
    stats = {
        tick: 0,
        roundTick: 0,
        organisms: 0,
        bestCells: 0,
        fps: '0',
        ups: '0',
    }
    lastFrameTime = new Date().getTime()
    lastUpdateTime = new Date().getTime()


    constructor() {

        env.games[this.ID] = this
    }
    init() {
        this.app.stage.children.sort((a, b) => a.zIndex - b.zIndex)

        this.initApp()
        this.initContainer()
        this.initGraphics()
        initStats(this)

        this.enableRender = env.settings.enableRender
        this.running = true
        this.winner = undefined
        this.graph = []
        this.organisms = {}
        this.cells = {}
        for (const type of CELL_TYPES) {

            this.cells[type] = {}
        }
        this.cellGraph = []
    
        for (let x = 0; x < env.graphSize; x++) {
            for (let y = 0; y < env.graphSize; y++) {

                const gridPos = new GridPos({ game: this }, { x: x * env.posSize, y: y * env.posSize })
                this.graph[packXY( x, y)] = gridPos
            }
        }

        const networks = Object.values(networkManager.networks)

        for (let i = 0; i < env.settings.organismsQuota; i++) {

            let pos = randomPos()

            while (this.cellGraph[packPos(pos)]) {

                pos = randomPos()
            }

            const organism = new Organism({
                game: this
            })
            organism.networkID = networks[i].ID
            const solarCell = new SolarCell({
                game: this,
                organism: organism,
            },
            {
                x: pos.x * env.posSize,
                y: pos.y * env.posSize,
            })
        }
    }
    private initApp() {

        const gameParent = document.createElement('div')
        gameParent.id = this.ID
        document.getElementById('envParent').appendChild(gameParent)

        const view = this.app.view as unknown as HTMLElement

        view.classList.add('game')
        view.id = 'game'
        gameParent.appendChild(view)

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
    reset() {

        for (let x = 0; x < env.graphSize; x++) {
            for (let y = 0; y < env.graphSize; y++) {

                const packedPos = packXY(x, y)
                const gridPos = this.graph[packedPos]
                gridPos.sprite.removeFromParent()

                const cell = this.cellGraph[packedPos]
                if (cell) cell.sprite.removeFromParent()
            }
        }

        this.init()
    }
    private runFPS(game: Game) {
        if (!env.settings.enableRender) return

        if (game.lastUpdateTime <= game.lastFrameTime) {

            return
        }
    
        for (const statName in env.stats) {
    
            document.getElementById(statName).innerText = env.stats[statName as keyof typeof env.stats].toString()
        }

        const thisFrameTime = new Date().getTime()
        game.stats.fps = (MAX_RUNNER_SPEED / (thisFrameTime - game.lastFrameTime)).toFixed(2)
        game.lastFrameTime = new Date().getTime()
    }

    async runUPS() {

        this.stats.tick += 1
        this.stats.roundTick += 1
        console.log('tick', this.stats.tick)

        this.graphics.clear()

        this.stats.organisms = 0
        this.stats.bestCells = 0

        this.run()
        if (!this.running) return false
    
        for (const statName in this.stats) {
    
            document.getElementById(statName + this.ID).innerText = this.stats[statName as keyof typeof this.stats].toString()
        }

        const thisUpdateTime = new Date().getTime()
        this.stats.ups = (MAX_RUNNER_SPEED / (thisUpdateTime - this.lastUpdateTime)).toFixed(2)
        this.lastUpdateTime = new Date().getTime()
        
        return true
    }
    async start() {

        this.app.ticker.add(() => { this.runFPS(this) })

        while (true) {
    
            await new Promise((resolve, reject) => {
                setTimeout(function() {
                    resolve(() => {})
                }, MAX_RUNNER_SPEED / env.settings.speed)
            })

            if (!await this.runUPS()) break
        }

        console.log('end game', this.ID, this.winner)
        return this.winner
    }
    run() {
        if (!this.running) return

        this.organismsCount = 0
        const organismsArray = Object.values(this.organisms)

        for (let i = 0; i < organismsArray.length; i++) {

            const organism = organismsArray[i]
            if (organism.cellCount > env.stats.bestCells) env.stats.bestCells = organism.cellCount

            organism.run(i === organismsArray.length - 1)
        }

        if (this.organismsCount === 1) {

            this.stop()
            return
        }

        if (this.stats.roundTick >= env.settings.roundTickLimit) {

            this.stop()
            return
        }
    }
    stop() {

        this.app.ticker.remove(() => { this.runFPS(this) })

        for (const ID in this.organisms) {

            const organism = this.organisms[ID]
            organism.killCells()
        }

        this.findWinner()
        this.running = false
    }
    private findWinner() {

        const [score, organismID] = findHighestScoreOfKeys(this.organisms, (organism) => roundFloat(organism.income + organism.energy / this.stats.roundTick, 2))
        if (score > env.stats.bestScore) env.stats.bestScore = score

        this.winner = this.organisms[organismID].networkID
    }
}