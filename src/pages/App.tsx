import React, { ReactElement } from 'react'
import { main } from '../scripts'
import { NetworkFrame } from '../scripts/neuralNetwork/networkFrame'
import './app.css'
import { env } from '../scripts/env/env'
import EnvStat from '../components/envStat'
import EnvSetting from '../components/envSetting'

function generateSettings() {

    const stats: JSX.Element[] = []

    for (const key in env.settings) {

        stats.push(<EnvSetting key={key} name={key as keyof typeof env.settings} value={env.settings[key as keyof typeof env.settings]} />)
    }

    return stats
}

function generateStats() {

    const stats: JSX.Element[] = []

    for (const key in env.stats) {

        stats.push(<EnvStat key={key} name={key as keyof typeof env.stats} value={env.stats[key as keyof typeof env.stats]} />)
    }

    return stats
}

window.onload = main
export default function App() {

  return (
    <main>
        <div className="envParent" id="envParent">

            <div className="displayParent">
                <div className="displayChild UIParent">

                    <h1 className="envTitle"><img className="envIcon" src={require('../images/logo.png')} />WebGine</h1>

                    <div className="statsParent">

                        {generateStats()}
                    </div>
                    <div className="flex column midGap">
                        {generateSettings()}
                    </div>
                    <form className="changeParent" id="form">

                        <button className="button waveButton" onClick={() => {env.manualReset()}}>Reset games</button>

                    </form>

                    <NetworkFrame />

                </div>
            </div>
        </div>
    </main>
  )
}