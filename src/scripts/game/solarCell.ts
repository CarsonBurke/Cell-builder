import { env } from '../env/env'
import { Texture, Sprite, Assets } from 'pixi.js'
import { Cell } from './cell'
import { CellTypes } from '../constants'

export class SolarCell extends Cell {

    energyGenerationRate = 1
    cost = 15

    /**
     * 
     * @param {*} opts must contiain a game and an organism parent
     * @param {*} spriteOpts must contain an x and y
     */
     constructor(opts: {[key: string]: any}, spriteOpts: {[key: string]: any}) {
        
        super()
        this.type = 'solarCell'

        this.init(opts, spriteOpts)
    }
    run() {

        this.organism.energy += this.energyGenerationRate
    }
}