class CellMembrane extends Cell {
    static texture = PIXI.Texture.from('sprites/cellMembrane.png')

    type = 'cellMembrane'
    energy = 0
    cost = 4

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

        this.sprite = new PIXI.Sprite(CellMembrane.texture)
        env.container.addChild(this.sprite)
    }
    run() {

        
    }
}