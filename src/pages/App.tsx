import React, { ReactElement } from 'react'
import { main } from '../scripts'
import { NetworkFrame } from '../scripts/neuralNetwork/networkFrame'
import './app.css'

window.onload = main
export default function App() {

  return (
      <main>
        <div className="envParent" id="envParent">

          <div className="displayParent">
              <div className="displayChild UIParent">

                  <h1 className="envTitle"><img className="envIcon" src={require('../images/logo.png')} />WebGine with three.js</h1>

                  <div className="statsParent">

                    <div className="statsChild">

                        <h3 className="statsHeader">Tick: </h3>
                        <h3 className="statsAmount" id="tick">0</h3>

                    </div>
                    <div className="statsChild">

                        <h3 className="statsHeader">Round Tick: </h3>
                        <h3 className="statsAmount" id="roundTick">0</h3>

                    </div>
                    <div className="statsChild">

                        <h3 className="statsHeader">Speed: </h3>
                        <h3 className="statsAmount" id="speed">0</h3>

                    </div>
                    <div className="statsChild">

                        <h3 className="statsHeader">FPS: </h3>
                        <h3 className="statsAmount" id="fps">0</h3>

                    </div>
                    <div className="statsChild">

                        <h3 className="statsHeader">UPS: </h3>
                        <h3 className="statsAmount" id="ups">0</h3>

                    </div>
                    <div className="statsChild">

                        <h3 className="statsHeader">Best Cells: </h3>
                        <h3 className="statsAmount" id="bestCells">0</h3>

                    </div>
                    <div className="statsChild">

                    <h3 className="statsHeader">Organisms: </h3>
                    <h3 className="statsAmount" id="organisms">0</h3>

                    </div>
                </div>
                <form className="changeParent" id="form">

                    <button className="resetButton waveButton" id="reset">Reset games</button>

                </form>
                <form className="changeParent" id="form">

                    <input className="changeInput" type="number" placeholder="Speed" id="newSpeed" />
                    <button className="changeButton waveButton" id="changeSpeed">Change</button>

                </form>

                <NetworkFrame />

            </div>
          </div>
        </div>
      </main>
  )
}