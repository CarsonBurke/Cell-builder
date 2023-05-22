import { Assets } from "pixi.js"

export const MAX_RUNNER_SPEED = 1000
export type CellTypes = 'solarCell' | 'collectorCell' | 'attackerCell' | 'cellMembrane'
export const CELL_TYPES: CellTypes[] = ['solarCell', 'collectorCell', 'attackerCell', 'cellMembrane']
export const GAME_OBJECT_TYPES = ['gridPos', 'organism', ...CELL_TYPES]
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