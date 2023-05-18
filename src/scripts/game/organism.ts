import { CellTypes, CELL_TYPES } from "../constants"
import { env } from "../env/env"
import { AttackerCell } from "./attackerCell"
import { CellMembrane } from "./cellMembrane"
import { CollectorCell } from "./collectorCell"
import { Game } from "./game"
import { forAdjacentPositions, packPos, unpackPos } from "./gameUtils"
import { SolarCell } from "./solarCell"
import { Cells } from "./types"

export class Organism {
    cells: Partial<Cells> = {}
    energy = 100
    type = 'organism'
    ID = env.newID()
    game: Game

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
    runCells() {

        this.expansionPositions = new Set()

        for (const key in this.cells) {
            const cellType = key as CellTypes

            for (const ID in this.cells[cellType]) {

                const cell = this.cells[cellType][ID]
                cell.run()

                forAdjacentPositions(cell.pos, 
                pos => {

                    this.expansionPositions.add(packPos(pos)) 
                })
            }
        }
    }
    runExpansion() {

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
            console.log(type)
            const cell = new CELL_CLASSES[type]({
                game: this.game,
                organism: this,
            }, 
            {
                x: pos.x * env.posSize,
                y: pos.y * env.posSize,
            })
        }
    }
}