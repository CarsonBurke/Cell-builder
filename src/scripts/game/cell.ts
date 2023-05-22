import { CellTypes } from "../constants"
import { env } from "../env/env"
import { Sprite } from 'pixi.js'
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

    constructor() {}
    init(opts: {[key: string]: any}, spriteOpts: {[key: string]: any}) {

        Object.assign(this, opts)

        this.ID = env.newID()

        this.initSprite(spriteOpts)
        this.assign()
    }
    private initSprite(spriteOpts: {[key: string]: any}) {

        this.sprite = new Sprite(env.sprites[this.type])
        env.container.addChild(this.sprite)

        Object.assign(this.sprite, spriteOpts)
    }
    private assign() {
        this.sprite.zIndex = 1

        this.organism.cells[this.type][this.ID] = this
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