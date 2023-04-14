class Game {
    
    running = false
    graph = new Uint8Array()

    constructor() {

        this.ID = env.newID()

        env.games[this.ID] = this
    }
    run() {
        
        
    }
    reset() {

        this.init()
    }
}

Game.prototype.init = function() {

    this.running = true

    this.graph = new Uint8Array(env.graphLength)
}

Game.prototype.visualize = function() {

    const texture = PIXI.Texture.from("sprites/player.png")
    const sprite = new PIXI.Sprite(texture);

    env.app.stage.addChild(sprite)
}