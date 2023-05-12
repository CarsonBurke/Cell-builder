import { env } from "../env/env"


export function packCoord(coord: Coord) {

    return coord.x * env.graphSize + coord.y
}

export function packXY(x: number, y: number) {

    return x * env.graphSize + y
}

export function unpackCoord(packedCoord: number) {

    return {
        x: Math.floor(packedCoord / env.graphSize),
        y: Math.floor(packedCoord % env.graphSize),
    }
}

/**
 * Takes a rectange and returns the positions inside of it in an array
 */
export function findCoordsInsideRect(x1: number, y1: number, x2: number, y2: number) {
    const positions = []

    for (let x = x1; x <= x2; x += 1) {
        for (let y = y1; y <= y2; y += 1) {
            // Iterate if the pos doesn't map onto a room

            if (x < 0 || x >= env.graphSize || y < 0 || y >= env.graphSize) continue

            // Otherwise pass the x and y to positions

            positions.push({ x, y })
        }
    }

    return positions
}

export function isXYInGraph(x: number, y: number) {

    return x >= 0 && x < env.graphSize && y >= 0 && y < env.graphSize
}

/**
 * Gets the range between two positions' x and y (Half Manhattan)
 * @param x1 the first position's x
 * @param y1 the first position's y
 * @param x2 the second position's x
 * @param y2 the second position's y
 */
export function getRange(x1: number, x2: number, y1: number, y2: number) {
    // Find the range using Chebyshev's formula

    return Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1))
}

export function getRangeOfCoords(coord1: Coord, coord2: Coord) {
    return getRange(coord1.x, coord2.x, coord1.y, coord2.y)
}

export function forAdjacentCoords(startCoord: Coord, f: (coord: Coord) => boolean) {
    for (let x = startCoord.x - 1; x <= startCoord.x + 1; x += 1) {
        for (let y = startCoord.y - 1; y <= startCoord.y + 1; y += 1) {
            if (x === startCoord.x && y === startCoord.y) continue
            if (!isXYInGraph(x, y)) continue

            f({ x, y })
        }
    }
}

/**
 * Excludes center around range
 */
export function forCoordsAroundRange(startCoord: Coord, range: number, f: (coord: Coord) => boolean) {
    for (let x = startCoord.x - range; x <= startCoord.x + range; x += 1) {
        for (let y = startCoord.y - range; y <= startCoord.y + range; y += 1) {
            if (x == startCoord.x && y === startCoord.y) continue
            // Iterate if the pos doesn't map onto a room

            if (x < 0 || x >= env.graphLength || y < 0 || y >= env.graphLength) continue

            f({ x, y })
        }
    }
}

/**
 * includes center around range
 */
export function forCoordsInRange(startCoord: Coord, range: number, f: (coord: Coord) => boolean) {
    for (let x = startCoord.x - range; x <= startCoord.x + range; x += 1) {
        for (let y = startCoord.y - range; y <= startCoord.y + range; y += 1) {
            // Iterate if the pos doesn't map onto a room

            if (x < 0 || x >= env.graphLength || y < 0 || y >= env.graphLength) continue

            f({ x, y })
        }
    }
}

export function randomBool() {

    return Math.floor(Math.random() * 2)
}

export function randomOnesOffset() {

    return randomBool() ? 1 : -1
}

export function randomOffsetFor(coord: Coord) {

    const offsetCoord = {
        x: -1,
        y: -1,
    }

    for (const key in offsetCoord) {

        let coordVal = offsetCoord[key as keyof Coord]

        while (coordVal < 0 || coordVal > env.graphSize) {

            coordVal = coord[key as keyof Coord] + randomOnesOffset()
        }

        offsetCoord[key as keyof Coord] = coordVal
    }

    return offsetCoord
}