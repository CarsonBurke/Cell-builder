import { Game } from "./game"
import { Texture, Sprite, Assets } from 'pixi.js'
import { env } from "../env/env"
import { packPos } from "./gameUtils"

export class GridPos {
    static texture = Assets.load('sprites/grass.png')
    static hoverTexture = Assets.load('sprites/grassHover.png')

    type = 'gridPos' as 'gridPos'
    energy = 0

    game: Game
    ID: string
    sprite: Sprite
    constructor(opts: {[key: string]: any}, spriteOpts: {[key: string]: any}) {

        Object.assign(this, opts)

        this.ID = env.newID()

        this.initSprite(spriteOpts)
        this.initInteractions()
        this.assign()
    }

    initSprite(spriteOpts: {[key: string]: any}) {

        this.sprite = new Sprite(env.textures[this.type])
        this.sprite.width = env.posSize
        this.sprite.height = env.posSize
        Object.assign(this.sprite, spriteOpts)

        if (!this.game.enableRender) return

        env.background.addChild(this.sprite)
    }

    private assign() {

        this.game.graph[this.packedPos] = this
    }

    initInteractions() {

        this.sprite.cursor = 'hover'
        this.sprite.eventMode = 'dynamic'

        const instance = this
        this.sprite.on('pointerover', function() { instance.hoverOn() })
        this.sprite.on('pointerout', function() { instance.hoverOff() })
    }

    async hoverOn() {

        this.sprite.texture = await GridPos.hoverTexture
    }

    async hoverOff() {

        this.sprite.texture = await GridPos.texture
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