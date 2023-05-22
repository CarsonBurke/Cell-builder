import { CellTypes } from '../constants'
import { env } from '../env/env'
import { Texture, Sprite, Assets } from 'pixi.js'
import { Cell } from './cell'
import { forPositionsAroundRange, packPos } from './gameUtils'

export class CollectorCell extends Cell {

    range = 3

    /**
     * 
     * @param {*} opts must contiain a game and an organism parent
     * @param {*} spriteOpts must contain an x and y
     */
    constructor(opts: {[key: string]: any}, spriteOpts: {[key: string]: any}) {

        super()
        this.type = 'collectorCell'

        this.init(opts, spriteOpts)
    }
    customInitialRun() {

        forPositionsAroundRange(this.pos, this.range, pos => {

            const packedPos = packPos(pos)

            const gridPos = this.game.graph[packedPos]
            if (!gridPos.energy) return

            this.organism.energy += gridPos.energy
            this.organism.income += gridPos.energy
            gridPos.energy = 0
        })
    }
}