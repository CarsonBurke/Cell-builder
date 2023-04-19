class Player {
    
    static texture = PIXI.Texture.from('sprites/player.png')
    static moveKeys = {
        'w': {
            x: 0,
            y: -1,
        },
        'a': {
            x: -1,
            y: 0,
        },
        's': {
            x: 0,
            y: 1,
        },
        'd': {
            x: 1,
            y: 0,
        },
    }
    movement = {
        x: 0,
        y: 0,
    }
    moveDirections = new Set()
    type = 'player'
    game
    sprite
    ID

    constructor(game, opts, spriteOpts) {

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
        const player = this

        window.addEventListener('keypress', function(event) { player.startMove(event.key) })
        window.addEventListener('keyup', function(event) { player.endMove(event.key) })
    }

    startMove(key) {

        const offset = Player.moveKeys[key]
        if (!offset) return

        if (this.moveDirections.has(key)) return
        this.moveDirections.add(key)

        this.movement.x += offset.x
        this.movement.y += offset.y
    }

    endMove(key) {

        const offset = Player.moveKeys[key]
        if (!offset) return

        this.moveDirections.delete(key)
        this.movement.x -= offset.x
        this.movement.y -= offset.y
    }

    move() {
        if (!this.movement.x && !this.movement.y) return

        this.sprite.x += this.movement.x
        this.sprite.y += this.movement.y
    }

    initSprite() {
        
        env.container.addChild(this.sprite)
    }
}