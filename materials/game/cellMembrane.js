class CellMembrane {
    static texture = PIXI.Texture.from('sprites/cellMembrane.png')
    static energyGenerationRate = 1

    type = 'attackerCell'
    ID = env.newID()
    energy = 0

    game
    organism
    ID
    sprite

    /**
     * 
     * @param {*} opts must contiain a game and an organism parent
     * @param {*} spriteOpts must contain an x and y
     */
    constructor(opts, spriteOpts) {

        Object.assign(this, opts)
        this.game.gameObjects[this.type][this.ID] = this

        this.initSprite()
        Object.assign(this.sprite, spriteOpts)
    }
    initSprite() {

        this.sprite = new PIXI.Sprite(CellMembrane.texture)
        env.container.addChild(this.sprite)
    }
    run() {

        if (this.game.gameObjects)
        this.organism.energy += CellMembrane.energyGenerationRate
    }
}