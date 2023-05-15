import { CellTypes } from "../constants"
import { env } from "../env/env"
import { Sprite } from "../pixi.min"
import { Game } from "./game"
import { packPos } from "./gameUtils"
import { Organism } from "./organism"


export class Cell {

    type: CellTypes
    ID: string
    game: Game
    organism: Organism
    sprite: Sprite
    cost: number

    /**
     * 
     * @param {*} opts must contiain a game and an organism parent=
     */
    constructor(opts: {[key: string]: any}) {
        Object.assign(this, opts)

        this.ID = env.newID()
    }
    assign() {

        this.game.cells[this.type][this.ID] = this
        this.game.cellGraph[this.packedPos] = this

        this.organism.energy -= this.cost
    }
    kill() {

        this.game.cellGraph[this.pos.x]
    }
    run() {

        console.log('default run')
    }

    get pos() {

        return {
            x: this.sprite.x / env.posSize,
            y: this.sprite.y / env.posSize,
        }
    }

    set pos(newPos) {

        this.game.cellGraph[this.packedPos] = undefined

        this.sprite.x = newPos.x * env.posSize
        this.sprite.y = newPos.y * env.posSize

        this.game.cellGraph[this.packedPos] = this
    }

    get packedPos() {

        return packPos(this.pos)
    }
}