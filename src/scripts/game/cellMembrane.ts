import { Cell } from "./cell"
import { Texture, Sprite } from '../pixi.js'
import { env } from "../env/env"

export class CellMembrane extends Cell {
    static texture = Texture.from('sprites/cellMembrane.png')

    energy = 0
    cost = 4

    /**
     * 
     * @param {*} opts must contiain a game and an organism parent
     * @param {*} spriteOpts must contain an x and y
     */
     constructor(opts: {[key: string]: any}, spriteOpts: {[key: string]: any}) {
        super(opts)

        this.type = 'cellMembrane'

        this.initSprite()
        Object.assign(this.sprite, spriteOpts)

        this.assign()
    }
    initSprite() {

        this.sprite = new Sprite(CellMembrane.texture)
        env.container.addChild(this.sprite)
    }
    run() {

        
    }
}