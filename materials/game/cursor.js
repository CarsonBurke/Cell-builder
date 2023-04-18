class Cursor {
    game
    type = 'cursor'
    
    constructor(game, opts = {}) {

        this.game = game
        this.ID = env.newID()
        Object.assign(this, opts)

        game.gameObjects[this.type][this.ID] = this

        this.render()
    }

    render() {


    }
}