import { env } from '../env/env.js'
import * as PIXI from '../pixi.min.js'
import { Cell } from './cell.js'

export class SolarCell extends Cell {
    static texture = PIXI.Texture.from('sprites/solarCell.png')
    static energyGenerationRate = 1

    cost = 15

    /**
     * 
     * @param {*} opts must contiain a game and an organism parent
     * @param {*} spriteOpts must contain an x and y
     */
     constructor(opts: {[key: string]: any}, spriteOpts: {[key: string]: any}) {
        super(opts)

        this.type = 'solarCell'

        this.initSprite()
        Object.assign(this.sprite, spriteOpts)

        this.assign()
    }
    initSprite() {

        this.sprite = new PIXI.Sprite(SolarCell.texture)
        env.container.addChild(this.sprite)
    }
    run() {

        this.organism.energy += SolarCell.energyGenerationRate
    }
}