class CollectorCell {
    static texture = PIXI.Texture.from('sprites/collectorCell.png')

    type = 'collectorCell'
    cost = 22

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

        this.organism.energy -= this.cost
    }
    initSprite() {

        this.sprite = new PIXI.Sprite(CollectorCell.texture)
        env.container.addChild(this.sprite)
    }
    run() {

        
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