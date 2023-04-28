class Cell {

    ID
    game
    organism
    sprite

    /**
     * 
     * @param {*} opts must contiain a game and an organism parent=
     */
    constructor(opts) {
        Object.assign(this, opts)

        this.ID = env.newID()
    }
    assign() {

        this.game.gameObjects[this.type][this.ID] = this
        this.game.cells[this.packedPos] = this
        this.organism.cells[this.type][this.ID] = this

        this.organism.energy -= this.cost
    }
    kill() {

        this.game.graph[this.pos]
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