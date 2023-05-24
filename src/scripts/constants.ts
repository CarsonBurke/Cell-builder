import { Output } from "./neuralNetwork/network"

export const MAX_RUNNER_SPEED = 1000
export type CellTypes = 'solarCell' | 'collectorCell' | 'attackerCell' | 'cellMembrane'
export const CELL_TYPES: CellTypes[] = ['solarCell', 'collectorCell', 'attackerCell', 'cellMembrane']
export const GAME_OBJECT_TYPES = ['gridPos', 'organism', ...CELL_TYPES]
export const CELL_DEATH_ENERGY_MULTIPLIER = 0.9
export const CELLS = {
    'solarCell': {
        cost: 15,
        upkeep: 0.01,
    }, 
    'collectorCell': {
        cost: 20,
        upkeep: 0.05,
    }, 
    'attackerCell': {
        cost: 45,
        upkeep: 0.1,
    }, 
    'cellMembrane': {
        cost: 4,
        upkeep: 0.001,
    }
}
export const adjacentOffsets = [
    {
        x: -1,
        y: -1,
    },
    {
        x: 0,
        y: -1,
    },
    {
        x: 1,
        y: -1,
    },
    {
        x: 1,
        y: 0,
    },
    {
        x: 1,
        y: 1,
    },
    {
        x: 0,
        y: 1,
    },
    {
        x: -1,
        y: 1,
    },
    {
        x: -1,
        y: 0,
    },
]
export const MAX_NETWORK_RUNS = 100
export const NETWORK_OUTPUTS = [
    // Build
    new Output('Build X'),
    new Output('Build X'),
    new Output('Build Solar'),
    new Output('Build Attacker'),
    new Output('Build Collector'),
    new Output('Build Membrane'),
    new Output('Build y/n'),
    // Distribute
    new Output('Maintain X'),
    new Output('Maintain Y'),
    new Output('Maintain y/n'),
    // Attack
    new Output('Attack X'),
    new Output('Attack Y'),
    new Output('Attack y/n'),
    // Go again
    new Output('Go Again y/n')
]