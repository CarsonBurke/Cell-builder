class Structure {
    static Texture
    type = 'structure'
    structureType
    sprite

    constructor(game, opts) {

        this.game = game
        this.ID = env.newID()
        Object.assign(this, opts)

        game.gameObjects[this.type][this.ID] = this
    }

    initSprite() {

        env.container.addChild(this.sprite)
    }
}