class Game {
    
    running = false
    graph = new Uint8Array()
    static gameObjectTypes = ['gridCoord', 'organism', ...CELL_TYPES]

    gameObjects = {}

    constructor() {

        this.ID = env.newID()

        env.games[this.ID] = this
    }
    init() {

        this.running = true
        this.graph = new Uint8Array(env.graphLength)
    
        for (const type of Game.gameObjectTypes) {

            this.gameObjects[type] = {}
        }
    
        for (let x = 0; x < env.graphSize; x++) {
            for (let y = 0; y < env.graphSize; y++) {

                new GridCoord(this, {}, { x: x * env.coordSize, y: y * env.coordSize })
            }
        }

        const organism = new Organism({
            game: this,
        })
        const cell = new SolarCell({
            game: this,
            organism: organism,
        },
        {
            x: env.coordSize,
            y: env.coordSize,
        })
    }
    reset() {

        for (const type of Game.gameObjectTypes) {

            for (const ID in this.gameObjects[type]) {

                delete this.gameObjects[type][ID]
            }
        }
        console.log('reset', this.gameObjects)
        this.init()
    }
    run() {
        
        for (const ID in this.gameObjects.organism) {

            const organism = this.gameObjects.organism[ID]
            console.log(organism)
            organism.run()
        }
    }
}