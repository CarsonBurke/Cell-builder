class Player {
    
    static texture = PIXI.Texture.from('sprites/player.png')
    sprite

    constructor(opts) {

        this.sprite = new PIXI.Sprite(this.texture)
        console.log(this.sprite)
        Object.assign(this, opts)
    }

    render() {

        env.app.stage.addChild(this.sprite)
    }
}