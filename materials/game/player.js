class Player {
    
    static texture = PIXI.Texture.from('sprites/player.png')
    type = 'player'
    game
    sprite

    constructor(game, opts = {}, spriteOpts = {}) {

        this.game = game
        this.ID = env.newID()
        Object.assign(this, opts)

        game.gameObjects[this.type][this.ID] = this

        this.sprite = new PIXI.Sprite(Player.texture)
        Object.assign(this.sprite, spriteOpts)

        this.initInteractions()
        this.initSprite()
    }

    initInteractions() {
        console.log('i')
        window.addEventListener('keypress', { function(event) { this.startMove(event.key) } })
        window.addEventListener('keyup', { function(event) { this.startMove(event.key) } })
    }

    startMove(key) {

        console.log('start', key)
    }

    endMove(key) {

        console.log('end', key)
    }

    initSprite() {
        
        env.app.stage.addChild(this.sprite)
    }
}