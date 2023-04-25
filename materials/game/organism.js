class Organism {
    cells = {}
    energy = 0
    type = 'organism'
    ID = env.newID()

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
    run() {

        console.log('run')
        console.log(this.energy)

        for (const cellType in this.cells) {

            for (const ID in this.cells[cellType]) {

                const cell = this.cells[cellType][ID]
                cell.run()
            }
        }
    }
}