class AttackerCell {
    static texture = PIXI.Texture.from('sprites/attackerCell.png')
    static energyGenerationRate = 1

    type = 'attackerCell'
    energy = 0
    cost = 45
    attackCost = 2

    ID
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

        this.sprite = new PIXI.Sprite(AttackerCell.texture)
        env.container.addChild(this.sprite)
    }
    run() {

        this.range = Math.floor(Math.pow(this.energy, 1.5))
        this.energy = 0

        
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