export class GridCoord {
    static texture = PIXI.Texture.from('sprites/grass.png')
    static hoverTexture = PIXI.Texture.from('sprites/grassHover.png')

    type = 'gridCoord'
    energy = 0

    game
    ID
    sprite
    constructor(game, opts, spriteOpts) {

        this.game = game
        this.ID = env.newID()
        Object.assign(this, opts)

        game.gameObjects[this.type][this.ID] = this

        this.sprite = new PIXI.Sprite(GridCoord.texture)
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

        this.sprite.texture = GridCoord.hoverTexture
    }

    hoverOff() {

        this.sprite.texture = GridCoord.texture
    }

    render() {

        env.container.addChild(this.sprite)
        this.sprite.width = env.coordSize
        this.sprite.height = env.coordSize
    }
}