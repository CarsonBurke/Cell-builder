import { Game } from "../game/game"
import * as THREE from 'three'

class Env {
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    gamesAmount = 1

    constructor() {

        this.games = {}
        this.graphSize = 20
        this.graphLength = this.graphSize * this.graphSize
        this.coordSize = 30
        this.searchCount = 1
        this.generationsQuota = 100
        this.IDIndex = 0
        this.width = this.graphSize * this.coordSize
        this.height = this.graphSize * this.coordSize
        this.lastReset = 0

        this.tick = 0
        this.roundTick = 0
        this.speed = 1
        this.bestTotalScore = 0
        this.bestGenScore = 0

        this.stats = [
            'tick',
            'roundTick',
            'speed',
            'bestTotalScore',
            'bestGenScore',
        ]
    }
    init() {

        this.initGames()
    }
    
    initGames() {
    
        //
    
        for (let i = 0; i < this.gamesAmount; i++) {
    
            const game = new Game()
            game.init()
        }
    }
    
    newID() {
    
        return this.IDIndex++
    }

    run() {
        console.log('i')

        this.runFPS()
        
        const date = new Date()

        let i = 0
        while (i !== date.getTime()) {
    
            this.runUPS()
            break
        }
    }

    runFPS() {

        console.log('f')
    
        for (const gameID in this.games) {
    
            const game = this.games[gameID]
            if (game.running) runningGames += 1
    
            game.visualize()
        }
    
        for (const statType of this.stats) {
    
            document.getElementById(statType).innerText = this[statType]
        }
    }

    runUPS() {

        
        console.log('u') 
        
        this.tick += 1
        this.roundTick += 1
    
        let runningGames = 0
    
        for (const gameID in this.games) {
    
            const game = this.games[gameID]
            if (game.running) runningGames += 1
    
            game.run()
        }
    
        for (const statType of this.stats) {
    
            document.getElementById(statType).innerText = this[statType]
        }
    
        //
    
        if (!runningGames) {
    
            this.reset()
        }
    }
    
    reset() {
    
        this.lastReset = this.tick
        this.roundTick = 0
        this.generation += 1
    
        for (const gameID in this.games) {
    
            const game = this.games[gameID]
    
            game.reset()
            game.init()
        }
    }
}

export const env = new Env()