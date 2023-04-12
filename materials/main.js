import { MAX_RUNNER_SPEED } from './constants'
import { env } from './env/env'
import * as THREE from 'three'

env.init()
env.run()

function main() {

    runFPS()
}

function runFPS() {

    requestAnimationFrame(runFPS())
}

function runUPS() {


}

document.getElementById('changeSpeed').addEventListener('click', changeSpeed)

changeSpeed()

function changeSpeed() {

    env.speed = parseInt(document.getElementById('newSpeed').value) || env.speed
}

document.getElementById('speedForm').addEventListener('submit', stopRefresh)

function stopRefresh(event) {

    event.preventDefault()
}