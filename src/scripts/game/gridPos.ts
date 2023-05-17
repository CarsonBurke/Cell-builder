import { Game } from "./game"
import { Texture, Sprite } from 'pixi.js'
import { env } from "../env/env"
import { packPos } from "./gameUtils"

export class GridPos {
    static texture = Texture.from('sprites/grass.png')
    static hoverTexture = Texture.from('sprites/grassHover.png')

    type = 'gridPos'
    energy = 0

    game: Game
    ID: string
    sprite: Sprite
    constructor(game: Game, opts: any, spriteOpts: any) {

        this.game = game
        this.ID = env.newID()
        Object.assign(this, opts)

        game.graph[this.packedPos] = this

        this.sprite = new Sprite(GridPos.texture)
        Object.assign(this.sprite, spriteOpts)

        this.initInteractions()
        this.render()
    }

    initInteractions() {

        this.sprite.cursor = 'hover'
        this.sprite.eventMode = 'dynamic'

        const instance = this
        this.sprite.on('pointerover', function() { instance.hoverOn() })
        this.sprite.on('pointerout', function() { instance.hoverOff() })
    }

    hoverOn() {

        this.sprite.texture = GridPos.hoverTexture
    }

    hoverOff() {

        this.sprite.texture = GridPos.texture
    }

    render() {

        env.container.addChild(this.sprite)
        this.sprite.width = env.posSize
        this.sprite.height = env.posSize
    }

    get pos() {

        return {
            x: this.sprite.x / env.posSize,
            y: this.sprite.y / env.posSize,
        }
    }

    set pos(newPos) {

        this.sprite.x = newPos.x * env.posSize
        this.sprite.y = newPos.y * env.posSize

        this.game.graph[this.packedPos] = this
    }

    get packedPos() {

        return packPos(this.pos)
    }
}