import { MAX_RUNNER_SPEED } from "./constants"
import { env } from "./env/env"
import { networkManager } from "./neuralNetwork/networkManager"

export async function main() {

    await env.init()
    
    const elements = document.getElementsByTagName('form')
    for (const el of elements) {
    
        el.addEventListener('submit', stopRefresh)
    }
    
    function stopRefresh(event: Event) {
    
        event.preventDefault()
    }
    
    document.addEventListener('click', event => { env.clickManager(event) })
    document.addEventListener('contextmenu', event => { env.onContextMenu(event) })

    env.run()
}