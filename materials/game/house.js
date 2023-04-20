class House extends Structure {
    static texture = PIXI.Texture.from('sprites/house.png')
    structureType = 'house'
    constructor(game, opts, spriteOpts) {

        super(game, opts)

        this.sprite = new PIXI.Sprite(House.texture)
        this.sprite.width = env.coordSize
        this.sprite.height = env.coordSize
        Object.assign(this.sprite, spriteOpts)

        this.initSprite()
    }

    initInteractions() {


    }
}