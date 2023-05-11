class SolarCell extends Cell {
    static texture = PIXI.Texture.from('sprites/solarCell.png')
    static energyGenerationRate = 1

    type = 'solarCell'
    cost = 15

    ID 
    sprite

    /**
     * 
     * @param {*} opts must contiain a game and an organism parent
     * @param {*} spriteOpts must contain an x and y
     */
    constructor(opts, spriteOpts) {
        super(opts)

        this.initSprite()
        Object.assign(this.sprite, spriteOpts)

        this.assign()
    }
    initSprite() {

        this.sprite = new PIXI.Sprite(SolarCell.texture)
        env.container.addChild(this.sprite)
    }
    run() {

        this.organism.energy += SolarCell.energyGenerationRate
    }
}