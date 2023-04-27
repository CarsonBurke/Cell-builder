class CellMembrane {
    static texture = PIXI.Texture.from('sprites/cellMembrane.png')
    static energyGenerationRate = 1

    type = 'cellMembrane'
    energy = 0

    ID
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

        this.ID = env.newID()

        Object.assign(this, opts)

        this.initSprite()
        Object.assign(this.sprite, spriteOpts)

        this.game.gameObjects[this.type][this.ID] = this
        this.game.cells[this.packedPos] = this
        this.organism.cells[this.type][this.ID] = this
    }
    initSprite() {

        this.sprite = new PIXI.Sprite(CellMembrane.texture)
        env.container.addChild(this.sprite)
    }
    run() {

        if (this.game.gameObjects)
        this.organism.energy += CellMembrane.energyGenerationRate
    }

    get pos() {

        return {
            x: this.sprite.x / env.coordSize,
            y: this.sprite.y / env.coordSize,
        }
    }

    set pos(newPos) {

        this.sprite.x = newPos.x * env.coordSize
        this.sprite.y = newPos.y * env.coordSize

        this.game.cells[this.packedPos] = this
    }

    get packedPos() {

        return packCoord(this.pos)
    }
}