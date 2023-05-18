import { CellTypes, CELL_TYPES } from "../constants"
import { env } from "../env/env"
import { AttackerCell } from "./attackerCell"
import { Cell } from "./cell"
import { CellMembrane } from "./cellMembrane"
import { CollectorCell } from "./collectorCell"
import { packXY } from "./gameUtils"
import { GridPos } from "./gridPos"
import { Organism } from "./organism"
import { SolarCell } from "./solarCell"
import { Cells } from "./types"

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
            }
        }

        const organism = new Organism({
            game: this,
        })
        const solarCell = new SolarCell({
            game: this,
            organism: organism,
        },
        {
            x: env.posSize,
            y: env.posSize,
        })
        const collectorCell = new CollectorCell({
            game: this,
            organism: organism,
        },
        {
            x: 2 * env.posSize,
            y: 2 * env.posSize,
        })
        const attackerCell = new AttackerCell({
            game: this,
            organism: organism,
        },
        {
            x: 3 * env.posSize,
            y: 3 * env.posSize,
        })
        const cellMembrane = new CellMembrane({
            game: this,
            organism: organism,
        },
        {
            x: 4 * env.posSize,
            y: 4 * env.posSize,
        })
    }
    reset() {

        this.init()
    }
    run() {

        for (const ID in this.organisms) {

            const organism = this.organisms[ID]

            organism.runCells()
        }

        for (const ID in this.organisms) {

            const organism = this.organisms[ID]

            organism.runExpansion()
        }
    }
}