class AttackerCell extends Cell {
    static texture = PIXI.Texture.from('sprites/attackerCell.png')
    static energyGenerationRate = 1

    type = 'attackerCell'
    energy = 0
    cost = 45
    attackCost = 2

    ID
    range
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

        this.sprite = new PIXI.Sprite(AttackerCell.texture)
        env.container.addChild(this.sprite)
    }
    run() {

        this.range = Math.floor(Math.pow(this.energy, 1.5))
        this.energy = 0

        forCoordsAroundRange(this.pos, this.range, coord => {
            console.log(coord)
            const packedCoord = packCoord(coord)

            const cell = this.game.cells[packedCoord]
            if (!this.cell) return

            cell.kill()
        })
    }
}