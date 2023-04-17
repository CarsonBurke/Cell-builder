class Game {
    
    running = false
    graph = new Uint8Array()
    gameObjects
    static gameObjectTypes = ['player']

    constructor() {

        this.ID = env.newID()

        env.games[this.ID] = this
    }
    init() {

        this.running = true
        this.graph = new Uint8Array(env.graphLength)
    
        this.gameObjects = {}
        for (const type of Game.gameObjectTypes) this.gameObjects[type] = {}
    
        new Player(this)
    }
    reset() {

        for (const type of Game.gameObjectTypes) {

            for (const ID in this.gameObjects[type]) {

                const object = this.gameObjects[type][ID]

                env.app.stage.removeChild(object.sprite)
            }
        }

        this.init()
    }
    run() {
        
        const players = this.gameObjects.player

        for (const ID in players) {

            const player = players[ID]

            player.sprite.x += 1
        }
    }
    visualize() {


    }
}