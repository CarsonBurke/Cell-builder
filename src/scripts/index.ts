import { MAX_RUNNER_SPEED } from "./constants"
import { env } from "./env/env"
import { networkManager } from "./neuralNetwork/networkManager"

export async function main() {

    await env.init()
    networkManager.init()
    
    runUPS()
    
    async function runUPS() {
    
        while (true) {
    
            await env.runUPS()
    
            await new Promise((resolve, reject) => {
                setTimeout(function() {
                    resolve(() => {})
                }, MAX_RUNNER_SPEED / env.speed)
            })
        }
    }
    
    document.getElementById('changeSpeed').addEventListener('click', changeSpeed)
    
    changeSpeed()
    
    function changeSpeed() {
    
        const speedInput = document.getElementById('newSpeed') as HTMLInputElement
        env.speed = parseInt(speedInput.value) || env.speed
    }
    
    document.getElementById('reset').addEventListener('click', resetGames)
    
    function resetGames() {
    
        env.reset()
    }
    
    const elements = document.getElementsByTagName('form')
    for (const el of elements) {
    
        el.addEventListener('submit', stopRefresh)
    }
    
    function stopRefresh(event: Event) {
    
        event.preventDefault()
    }
    
    document.addEventListener('click', event => { env.clickManager(event) })
    document.addEventListener('contextmenu', event => { env.onContextMenu(event) })
}