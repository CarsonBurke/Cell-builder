class CollectorCell extends Cell {
    static texture = PIXI.Texture.from('sprites/collectorCell.png')

    type = 'collectorCell'
    cost = 22

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

        this.sprite = new PIXI.Sprite(CollectorCell.texture)
        env.container.addChild(this.sprite)
    }
    run() {

        
    }
}