class AttackerCell {
    static texture = PIXI.Texture.from('sprites/attackerCell.png')
    static energyGenerationRate = 1

    type = 'attackerCell'
    ID = env.newID()
    energy = 0

    range
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

        this.sprite = new PIXI.Sprite(AttackerCell.texture)
        env.container.addChild(this.sprite)
    }
    run() {

        this.range = Math.floor(Math.pow(this.energy, 1.5))
        this.energy = 0

        

        this.organism.energy += AttackerCell.energyGenerationRate
    }
}