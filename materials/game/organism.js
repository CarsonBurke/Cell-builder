class Organism {
    cells = {}
    energy = 0
    type = 'organism'
    ID = env.newID()

    expansionCoords = new Set()

    /**
     * 
     * @param {*} opts Must include a game
     */
    constructor(opts) {

        
        for (const cellType of CELL_TYPES) {

            this.cells[cellType] = {}
        }

        Object.assign(this, opts)
        this.game.gameObjects[this.type][this.ID] = this
    }
    runCells() {

        this.expansionCoords = new Set()

        for (const cellType in this.cells) {

            for (const ID in this.cells[cellType]) {

                const cell = this.cells[cellType][ID]
                cell.run()

                forAdjacentCoords(cell.pos, 
                coord => {

                    this.expansionCoords.add(packXY(coord.x, coord.y)) 
                })
            }
        }
    }
    runExpansion() {

        for (const packedCoord of this.expansionCoords) {
            console.log('cell', this.game.cells[packedCoord])
            if (this.game.cells[packedCoord]) continue

            const coord = unpackCoord(packedCoord)

            const type = Math.floor(Math.random() * CELL_TYPES.length - 1)
            const cell = new CellMembrane({
                game: this.game,
                organism: this,
            }, 
            {
                x: coord.x * env.coordSize,
                y: coord.y * env.coordSize,
            })
        }
    }
}