class SolarCell {
    static texture = PIXI.Texture.from('sprites/solarCell.png')
    static energyGenerationRate = 1

    type = 'solarCell'
    ID = env.newID()

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

        this.sprite = new PIXI.Sprite(SolarCell.texture)
        env.container.addChild(this.sprite)
    }
    run() {

        this.organism.energy += SolarCell.energyGenerationRate
    }
}