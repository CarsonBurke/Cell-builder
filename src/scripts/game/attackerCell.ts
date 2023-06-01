import { env } from "../env/env"
import { Cell } from "./cell"
import { Texture, Sprite } from 'pixi.js'
import { forPositionsAroundRange, getRange, getRangeOfPositions, packPos, randomChance, randomFloat } from "./gameUtils"
import { CellTypes } from "../constants"
import { Pos } from "../types"

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
    customRun() {
        if (!this.organism.tickAttack) return

        this.range = Math.floor(Math.pow(this.organism.energy / 10, 0.5))/* Math.floor(Math.pow(this.energy, 1.5)) */ /* Math.round(Math.pow(Object.keys(this.organism.cells.solarCell).length, 0.3)) */

        let targets = Math.floor(Math.pow(this.organism.energy / 10, 1))

        forPositionsAroundRange(this.pos, this.range, pos => {
            if (targets === 0) return

            const packedPos = packPos(pos)

            const cell = this.game.cellGraph[packedPos]
            if (!cell) return
            if (cell.organism.ID === this.organism.ID) return

            if (this.organism.energy === 0) return
            // console.log(Math.round(Math.pow(getRangeOfPositions(this.pos, cell.pos) / 10, 1.1)))
/*             
            this.organism.energy -= 1 + Math.round(Math.pow(getRangeOfPositions(this.pos, cell.pos) / 10, 1.1))
            this.organism.energy = Math.max(0, this.organism.energy)
 */
            cell.damage(10)

            this.targetGraphic(cell.sprite.position)

            targets -= 1
            return
        })
    }
    private targetGraphic(targetPos: Pos) {

        if (!this.game.enableRender) return

        env.graphics.beginFill('rgb(255, 0, 0)')
        .lineStyle(2, 'rgb(255, 0, 0)', 1)
        .moveTo(this.sprite.position.x + env.posSize / 2, this.sprite.position.y + env.posSize / 2)
        .lineTo(targetPos.x + env.posSize / 2, targetPos.y + env.posSize / 2)
        .closePath()
        .endFill()
    }
}