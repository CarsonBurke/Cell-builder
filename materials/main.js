
env.init()

main()

function main() {

    runUPS()
    runFPS()
}

function runFPS() {

    requestAnimationFrame(runFPS)

    env.runFPS()
}

async function runUPS() {

    while (true) {

        env.runUPS()

        await new Promise((resolve, reject) => {
            setTimeout(function() {
                resolve()
            }, MAX_RUNNER_SPEED / env.speed)
        })
    }
}

document.getElementById('changeSpeed').addEventListener('click', changeSpeed)

changeSpeed()

function changeSpeed() {

    env.speed = parseInt(document.getElementById('newSpeed').value) || env.speed
}

document.getElementById('reset').addEventListener('click', resetGames)

function resetGames() {

    env.reset()
}

const elements = document.getElementsByTagName('form')
for (const el of elements) {

    el.addEventListener('submit', stopRefresh)
}

function stopRefresh(event) {

    event.preventDefault()
}