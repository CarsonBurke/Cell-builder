import { CellTypes, CELL_TYPES, CELLS, MAX_NETWORK_RUNS, NETWORK_OUTPUTS, NETWORK_OUTPUTS_STRUCTURE } from "../constants"
import { env } from "../env/env"
import { AttackerCell } from "./attackerCell"
import { CellMembrane } from "./cellMembrane"
import { CollectorCell } from "./collectorCell"
import { Game } from "./game"
import { findHighestIndexOfScore, findHighestScore, forAdjacentPositions, packPos, packXY, randomFloat, randomHSL, unpackPos } from "./gameUtils"
import { SolarCell } from "./solarCell"
import { Cells } from "../types"
import { networkManager } from "../neuralNetwork/networkManager"
import { Input } from "../neuralNetwork/network"

const CELL_CLASSES = {
    'solarCell': SolarCell,
    'collectorCell': CollectorCell,
    'attackerCell': AttackerCell,
    'cellMembrane': CellMembrane,
}

export class Organism {
    cells: Partial<Cells> = {}
    lastEnergy = 0
    energy = 10
    income = 0
    cellCount = 0
    type = 'organism'
    ID = env.newID()
    game: Game
    hue = randomHSL()
    networkID: string
    /**
     * Wether the organism's network has at least tried to do an action in its latest run
     */
    tickActioned: boolean
    /**
     * Wether or not the organism should try to attack this tick
     */
    tickAttack: boolean
    dead: boolean

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
    run(lastOrganism: boolean) {
        if (this.dead) return

        this.tickActioned = false

/*         console.log('run', this.energy.toFixed(2), this.income.toFixed(2)) */

        this.income = 0
        this.cellCount = 0
        this.expansionPositions = new Set()

        this.initialRunCells()
        if (this.killIfViable(lastOrganism)) return
        
        this.runNetwork()
        this.runCells()
/* 
        this.runExpansion()
         */

        this.lastEnergy = this.energy
        this.game.organismsCount += 1
        env.stats.organisms += 1
    }
    private runNetwork() {

        let runsLeft = MAX_NETWORK_RUNS
        while (true) {
            this.tickActioned = false
            runsLeft -= 1

            const inputs = [
                // General
                new Input('Last energy', [this.lastEnergy], ['-1']),
                new Input('Runs left', [runsLeft], ['0']),
                new Input('Income', [this.income], ['1']),
                new Input('Energy', [this.energy], ['2']),
            ]

            // Cells and positions

            for (let x = 0; x < env.graphSize; x += 1) {
                for (let y = 0; y < env.graphSize; y += 1) {

                    const packedPos = packXY(x, y)
                    const cell = this.game.cellGraph[packedPos]

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
                            +!!cell,
                            // Wether we own the cell, if it exists
                            +(cell ? cell.organism.ID === this.ID : false),
                            // Wetjer the pos is an expansion pos
                            +this.expansionPositions.has(packedPos)
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

            const network = networkManager.networks[this.networkID]
            network.forwardPropagate(inputs)
            
            // Output actions
            
            const lastLayer = network.activationLayers[network.activationLayers.length - 1]

            this.build(lastLayer)

            this.tickAttack = !!lastLayer[6]

            // Repeat and visuals logic

            // If we should go again
            if (!this.tickActioned || !lastLayer[5] || runsLeft <= 0) {

                if (env.settings.networkVisuals) {

                    if (!network.visualsParent) network.createVisuals(inputs, NETWORK_OUTPUTS)
                    network.updateVisuals(inputs)
                }
                return
            }
        }
    }
    private build(lastLayer: number[]) {

        const expansionPositionsArray = Array.from(this.expansionPositions)
        if (!expansionPositionsArray.length) return

        const packedPos = Array.from(this.expansionPositions)[0]
        const pos = unpackPos(packedPos)

        const [score, index] = findHighestIndexOfScore(lastLayer.slice(0, 5), (val) => { return val })

        if (index >= CELL_TYPES.length) return

        const type = CELL_TYPES[index]
        if (this.energy < CELLS[type].cost) return

        this.tickActioned = true

        /* console.log(type) */

        new CELL_CLASSES[type]({
            game: this.game,
            organism: this,
        }, 
        {
            x: pos.x * env.posSize,
            y: pos.y * env.posSize,
        })

        this.expansionPositions.delete(packedPos)
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

        for (const key in this.cells) {
            const cellType = key as CellTypes

            for (const ID in this.cells[cellType]) {

                const cell = this.cells[cellType][ID]
                cell.run()
            }
        }
    }
    private runExpansion() {

        for (const packedPos of this.expansionPositions) {

            if (this.energy <= 0) break
            if (this.game.cellGraph[packedPos]) continue

            const pos = unpackPos(packedPos)
            const type = CELL_TYPES[Math.floor(Math.random() * (CELL_TYPES.length))] as CellTypes

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

            this.energy = Math.max(0, this.energy)
        }
    }
    private killIfViable(lastOrganism: boolean) {

        if (this.game.organismsCount === 1 && lastOrganism) return false
        if (this.cellCount > 0) return false

        this.kill()
        return true
    }
    private kill(hasCells?: boolean) {

        if (hasCells) this.killCells()

        this.income = 0
        this.energy = 0
        this.dead = true
    }
    killCells() {

        for (const key in this.cells) {
            const cellType = key as CellTypes

            for (const ID in this.cells[cellType]) {

                const cell = this.cells[cellType][ID]
                cell.kill()
            }
        }
    }
}