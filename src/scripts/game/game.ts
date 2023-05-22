import { CellTypes, CELL_TYPES } from "../constants"
import { env } from "../env/env"
import { AttackerCell } from "./attackerCell"
import { Cell } from "./cell"
import { CellMembrane } from "./cellMembrane"
import { CollectorCell } from "./collectorCell"
import { packXY, randomChance } from "./gameUtils"
import { GridPos } from "./gridPos"
import { Organism } from "./organism"
import { SolarCell } from "./solarCell"
import { Cells } from "../types"

export class Game {
    ID = env.newID()
    running = false
    graph: GridPos[]
    organisms: {[ID: string]: Organism}
    cells: Cells
    cellGraph: Cell[]

    constructor() {

        env.games[this.ID] = this
    }
    init() {

        this.running = true
        this.graph = []
        this.organisms = {}
        this.cells = {}
        for (const type of CELL_TYPES) {

            this.cells[type] = {}
        }
        this.cellGraph = []
    
        for (let x = 0; x < env.graphSize; x++) {
            for (let y = 0; y < env.graphSize; y++) {

                const gridPos = new GridPos(this, {}, { x: x * env.posSize, y: y * env.posSize })
                this.graph[packXY( x, y)] = gridPos

                if (randomChance(2)) {

                    const organism = new Organism({
                        game: this,
                    })
                    const solarCell = new SolarCell({
                        game: this,
                        organism: organism,
                    },
                    {
                        x: x * env.posSize,
                        y: y * env.posSize,
                    })
                }
            }
        }
    }
    reset() {

        this.init()
    }
    run() {

        for (const ID in this.organisms) {

            const organism = this.organisms[ID]

            env.stats.organisms += 1
            if (organism.cellCount > env.stats.bestCells) env.stats.bestCells = organism.cellCount

            organism.run()
        }
    }
}