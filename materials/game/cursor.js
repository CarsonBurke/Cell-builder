class Cursor {
    static texture = PIXI.Texture.from('sprites/cursor.png')
    game
    ID
    sprite
    type = 'cursor'
    
    constructor(game, opts, spriteOpts) {

        this.game = game
        this.ID = env.newID()
        Object.assign(this, opts)

        game.gameObjects[this.type][this.ID] = this

        this.sprite = new PIXI.Sprite(Cursor.texture)
        Object.assign(this.sprite, spriteOpts)

        this.render()
    }

    render() {

        const defaultIcon = "url('sprites/cursor.png'),auto"
        const hoverIcon = "url('sprites/cursor.png'),auto"

        env.app.renderer.events.cursorStyles.default = defaultIcon
        env.app.renderer.events.cursorStyles.hover = hoverIcon
    }
}