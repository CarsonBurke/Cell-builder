class Game {
    
    running = false
    graph = new Uint8Array()
    gameObjects
    static gameObjectTypes = ['player', 'gridCoord', 'cursor']

    constructor() {

        this.ID = env.newID()

        env.games[this.ID] = this
    }
    init() {

        this.running = true
        this.graph = new Uint8Array(env.graphLength)
    
        this.gameObjects = {}
        for (const type of Game.gameObjectTypes) this.gameObjects[type] = {}
    
        for (let x = 0; x < env.graphSize; x++) {
            for (let y = 0; y < env.graphSize; y++) {

                new GridCoord(this, {}, { x: x * env.coordSize, y: y * env.coordSize })
            }
        }

        new Cursor(this)
        new Player(this)
    }
    reset() {

        for (const type of Game.gameObjectTypes) {

            for (const ID in this.gameObjects[type]) {

                delete this.gameObjects[type][ID]
            }
        }
        console.log(this.gameObjects)
        this.init()
    }
    run() {
        
        const players = this.gameObjects.player

        for (const ID in players) {

            const player = players[ID]
            player.move()
        }

        const cursors = this.gameObjects.cursors

        for (cosnt ID in cursors) {

            const cursor = cursors[ID]
        }
    }
}