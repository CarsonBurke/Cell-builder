import { CELLS, CELL_DEATH_ENERGY_MULTIPLIER, CellTypes } from "../constants"
import { env } from "../env/env"
import { Sprite } from 'pixi.js'
import { Game } from "./game"
import { forAdjacentPositions, packPos } from "./gameUtils"
import { Organism } from "./organism"


export class Cell {

    type: CellTypes
    ID: string
    game: Game
    organism: Organism
    sprite: Sprite

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
        this.sprite.zIndex = 2

        this.organism.cells[this.type][this.ID] = this
        this.game.cells[this.type][this.ID] = this
        this.game.cellGraph[this.packedPos] = this

        this.organism.energy -= CELLS[this.type].cost
    }
    kill() {
        this.game.graph[this.packedPos].energy += CELLS[this.type].cost * CELL_DEATH_ENERGY_MULTIPLIER

        this.sprite.removeFromParent()

        delete this.organism.cells[this.type][this.ID]
        delete this.game.cells[this.type][this.ID]
        this.game.cellGraph[this.packedPos] = undefined
    }
    initialRun() {

        this.organism.cellCount += 1

        this.organism.energy -= CELLS[this.type].upkeep
        this.organism.income -= CELLS[this.type].upkeep

        this.customInitialRun()
    }
    /**
     * Type placeholder
     */
    customInitialRun() {

        
    }
    run() {

        // Find expansion coords

        forAdjacentPositions(this.pos, 
            pos => {
                if (this.game.cellGraph[packPos(pos)]) return

                this.organism.expansionPositions.add(packPos(pos)) 
            })
        
        // Gr
        

        this.customRun()
    }
    /**
     * Type placeholder
     */
    customRun() {

        
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