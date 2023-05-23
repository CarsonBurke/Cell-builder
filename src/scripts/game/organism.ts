import { CellTypes, CELL_TYPES, CELLS } from "../constants"
import { env } from "../env/env"
import { AttackerCell } from "./attackerCell"
import { CellMembrane } from "./cellMembrane"
import { CollectorCell } from "./collectorCell"
import { Game } from "./game"
import { forAdjacentPositions, packPos, randomFloat, randomHSL, unpackPos } from "./gameUtils"
import { SolarCell } from "./solarCell"
import { Cells } from "../types"

export class Organism {
    cells: Partial<Cells> = {}
    energy = 15
    income = 0
    cellCount = 0
    type = 'organism'
    ID = env.newID()
    game: Game
    hue = randomHSL()

    expansionPositions: Set<number> = new Set()

    /**
     * 
     * @param {*} opts Must include a game
     */
    constructor(opts: {[key: string]: any}) {

        
        for (const cellType of CELL_TYPES) {

            this.cells[cellType] = {}
        }

        Object.assign(this, opts)

        this.game.organisms[this.ID] = this
    }
    run() {
/*         console.log('run', this.energy.toFixed(2), this.income.toFixed(2)) */
        this.income = 0
        this.cellCount = 0

        this.initialRunCells()
        if (this.energy < 0) this.kill(true)
        if (this.cellCount === 0) this.kill()

        this.runCells()
        this.runExpansion()
    }
    private initialRunCells() {

        for (const key in this.cells) {
            const cellType = key as CellTypes

            for (const ID in this.cells[cellType]) {

                const cell = this.cells[cellType][ID]
                cell.initialRun()
            }
        }
    }
    private runCells() {

        this.expansionPositions = new Set()

        for (const key in this.cells) {
            const cellType = key as CellTypes

            for (const ID in this.cells[cellType]) {

                const cell = this.cells[cellType][ID]
                cell.run()
            }
        }
    }
    private runExpansion() {

        const CELL_CLASSES = {
            'solarCell': SolarCell,
            'collectorCell': CollectorCell,
            'attackerCell': AttackerCell,
            'cellMembrane': CellMembrane,
        }

        for (const packedPos of this.expansionPositions) {

            if (this.energy <= 0) break
            if (this.game.cellGraph[packedPos]) continue

            const pos = unpackPos(packedPos)
            const type = CELL_TYPES[Math.floor(Math.random() * (CELL_TYPES.length))] as CellTypes

            /* if (CELLS[type].cost > this.energy) continue */

            const cell = new CELL_CLASSES[type]({
                game: this.game,
                organism: this,
            }, 
            {
                x: pos.x * env.posSize,
                y: pos.y * env.posSize,
            })

            this.energy = Math.max(0, this.energy)
        }
    }
    private kill(hasCells?: boolean) {

        console.log('kill')

        if (hasCells) this.killCells()

        delete this.game.organisms[this.ID]
    }
    private killCells() {

        for (const key in this.cells) {
            const cellType = key as CellTypes

            for (const ID in this.cells[cellType]) {

                const cell = this.cells[cellType][ID]
                cell.kill()
            }
        }
    }
}