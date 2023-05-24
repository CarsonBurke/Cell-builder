import { CellTypes, CELL_TYPES, CELLS, MAX_NETWORK_RUNS, NETWORK_OUTPUTS } from "../constants"
import { env } from "../env/env"
import { AttackerCell } from "./attackerCell"
import { CellMembrane } from "./cellMembrane"
import { CollectorCell } from "./collectorCell"
import { Game } from "./game"
import { forAdjacentPositions, packPos, packXY, randomFloat, randomHSL, unpackPos } from "./gameUtils"
import { SolarCell } from "./solarCell"
import { Cells } from "../types"
import { networkManager } from "../neuralNetwork/networkManager"
import { Input } from "../neuralNetwork/network"

export class Organism {
    cells: Partial<Cells> = {}
    energy = 15
    income = 0
    cellCount = 0
    type = 'organism'
    ID = env.newID()
    game: Game
    hue = randomHSL()
    networkID: string
    nextCellType: CellTypes

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
        if (this.cellCount === 0) this.kill()

        this.runNetwork()

        this.runCells()

        this.runExpansion()
    }
    private runNetwork() {

        let runsLeft = MAX_NETWORK_RUNS
        const inputs  = [
            // General
            new Input('Runs left', [runsLeft], ['0']),
            new Input('Income', [this.income], ['1']),
            new Input('Energy', [this.energy], ['2']),
        ]

        for (; runsLeft > 0; runsLeft -= 1) {

            // Cells and positions

            for (let x = 0; x < env.graphSize; x += 1) {
                for (let y = 0; y < env.graphSize; y += 1) {

                    const cell = this.game.cellGraph[packXY(x, y)]

                    inputs.push(
                        new Input(x + ', ' + y, [
                            x,
                            y,
                            // The type as cell as 0 | 1
                            +(cell ? cell.type === 'solarCell' : false),
                            +(cell ? cell.type === 'attackerCell' : false),
                            +(cell ? cell.type === 'collectorCell' : false),
                            +(cell ? cell.type === 'cellMembrane' : false),
                            // Wether the cell exists
                            +cell,
                            // Wether we own the cell, if it exists
                            +(cell ? cell.organism.ID === this.ID : false),
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
                        ])
                    )
                }
            } 

            // Expansion positions

            for (const packedPos of this.expansionPositions) {

                const pos = unpackPos(packedPos)

                inputs.push(
                    new Input(pos.x + ', ' + pos.y, [
                        pos.x,
                        pos.y,
                    ], 
                    [
                        '11',
                    ])
                )
            }

            const network = networkManager.networks[this.networkID]
            network.forwardPropagate(inputs)
            network.updateVisuals(inputs)
        }
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
            const type = this.nextCellType = this.nextCellType || CELL_TYPES[Math.floor(Math.random() * (CELL_TYPES.length))] as CellTypes

            /* if (CELLS[type].cost > this.energy) continue */

            if (CELLS[type].cost + (CELLS[type].upkeep * Object.keys(this.cells[type]).length + 1) > this.energy) break
            if (this.income - CELLS[type].upkeep * Object.keys(this.cells[type]).length + 1 <= 0) break

            const cell = new CELL_CLASSES[type]({
                game: this.game,
                organism: this,
            }, 
            {
                x: pos.x * env.posSize,
                y: pos.y * env.posSize,
            })

            this.nextCellType = undefined
            this.energy = Math.max(0, this.energy)
        }
    }
    private kill(hasCells?: boolean) {

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