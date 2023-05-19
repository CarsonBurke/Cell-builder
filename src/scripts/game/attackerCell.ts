import { env } from "../env/env"
import { Cell } from "./cell"
import { Texture, Sprite } from '../pixi.js'
import { forPositionsAroundRange, packPos } from "./gameUtils"

export class AttackerCell extends Cell {
    static texture = Texture.from('sprites/attackerCell.png')
    static energyGenerationRate = 1

    energy = 0
    cost = 45
    attackCost = 2
    range = 0

    /**
     * 
     * @param {*} opts must contiain a game and an organism parent
     * @param {*} spriteOpts must contain an x and y
     */
    constructor(opts: {[key: string]: any}, spriteOpts: {[key: string]: any}) {
        super(opts)

        this.type = 'attackerCell'

        this.initSprite()
        Object.assign(this.sprite, spriteOpts)

        this.assign()
    }
    initSprite() {

        this.sprite = new Sprite(AttackerCell.texture)
        env.container.addChild(this.sprite)
    }
    run() {

        this.range = Math.floor(Math.pow(this.energy, 1.5))
        this.energy = 0

        forPositionsAroundRange(this.pos, this.range, pos => {
            console.log(pos)
            const packedPos = packPos(pos)

            const cell = this.game.cellGraph[packedPos]
            if (!cell) return

            cell.kill()
        })
    }
}