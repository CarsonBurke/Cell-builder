import { env } from "../env/env"
import { Cell } from "./cell"
import { Texture, Sprite, Assets } from 'pixi.js'
import { forPositionsAroundRange, packPos, randomFloat } from "./gameUtils"
import { CellTypes } from "../constants"

export class AttackerCell extends Cell {

    energy = 0
    attackCost = 2
    range = 0

    /**
     * 
     * @param {*} opts must contiain a game and an organism parent
     * @param {*} spriteOpts must contain an x and y
     */
    constructor(opts: {[key: string]: any}, spriteOpts: {[key: string]: any}) {

        super()
        this.type = 'attackerCell'

        this.init(opts, spriteOpts)
    }
    customInitialRun() {
        if (this.organism.energy === 0) return

        this.range = /* Math.floor(Math.pow(this.energy, 1.5)) */ 1 + Math.round(Math.pow(Object.keys(this.organism.cells.solarCell).length, 0.5))
        this.energy = 0

        forPositionsAroundRange(this.pos, this.range, pos => {

            const packedPos = packPos(pos)

            const cell = this.game.cellGraph[packedPos]
            if (!cell) return
            if (cell.organism.ID === this.organism.ID) return

            cell.kill()
        })
    }
}