import React, { ReactElement } from 'react'
import { main } from '../scripts'
import { NetworkFrame } from '../scripts/neuralNetwork/networkFrame'
import './app.css'



main()

export default function App() {

  return (
    <div className="app">
      <main>
          <NetworkFrame></NetworkFrame>
      </main>
    </div>
  )
}