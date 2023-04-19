class GridCoord {
    static texture = PIXI.Texture.from('sprites/grass.png')
    game
    ID
    sprite
    type = 'gridCoord'
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


    }

    render() {

        env.container.addChild(this.sprite)
        this.sprite.width = env.coordSize
        this.sprite.height = env.coordSize
    }
}