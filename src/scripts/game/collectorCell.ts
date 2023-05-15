import { CellTypes } from '../constants.js'
import { env } from '../env/env.js'
import * as PIXI from '../pixi.min.js'
import { Cell } from './cell.js'

export class CollectorCell extends Cell {
    static texture = PIXI.Texture.from('sprites/collectorCell.png')

    cost = 22

    /**
     * 
     * @param {*} opts must contiain a game and an organism parent
     * @param {*} spriteOpts must contain an x and y
     */
    constructor(opts: {[key: string]: any}, spriteOpts: {[key: string]: any}) {
        super(opts)

        this.type = 'collectorCell'

        this.initSprite()
        Object.assign(this.sprite, spriteOpts)

        this.assign()
    }
    initSprite() {

        this.sprite = new PIXI.Sprite(CollectorCell.texture)
        env.container.addChild(this.sprite)
    }
    run() {

        
    }
}