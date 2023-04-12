import { env } from '../env/env'
import * as THREE from 'three'

export class Game {
    
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

    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    env.scene.add( cube );
    
    env.camera.position.z = 5;

    /* renderer.render(env.scene, env.camera) */
}