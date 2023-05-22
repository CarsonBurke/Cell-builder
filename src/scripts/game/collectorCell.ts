import { CellTypes } from '../constants'
import { env } from '../env/env'
import { Texture, Sprite, Assets } from 'pixi.js'
import { Cell } from './cell'

export class CollectorCell extends Cell {

    range = 3
    cost = 22

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
    run() {

        
    }
}