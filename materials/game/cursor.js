class Cursor {
    static Texture = PIXI.Texture.from('sprites/cursor.png')
    game
    type = 'cursor'
    
    constructor(game, opts = {}) {

        this.game = game
        this.ID = env.newID()
        Object.assign(this, opts)

        game.gameObjects[this.type][this.ID] = this

        this.sprite = new PIXI.Sprite(Player.texture)
        Object.assign(this.sprite, spriteOpts)

        this.render()
    }

    move() {

        const event = window.event
        console.log(event, event.clientX, event.clientY)

        this.sprite.x = event.clientX
        this.sprite.y = event.clientY
    }

    render() {

        env.container.addChild(this.sprite)
    }
}