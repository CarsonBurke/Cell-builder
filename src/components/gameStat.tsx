
import { env } from '../scripts/env/env'
import { Game } from '../scripts/game/game'

interface GameStatArgs {
    gameID: string
    name: keyof typeof env.stats
    value: any
}

export default function GameStat(args: GameStatArgs) {

    return (
        <div className="statsChild">

            <h3 className="statsHeader">{args.name}: </h3>
            <h3 className="statsAmount" id={args.name + args.gameID}>{args.value}</h3>

        </div>
    )
}

export function initStats(game: Game) {

    const stats: JSX.Element[] = []

    for (const key in game.stats) {

        document.getElementById(game.ID).appendChild(<GameStat gameID={game.ID} key={key} name={key as keyof typeof env.stats} value={env.stats[key as keyof typeof env.stats]} /> as unknown as Node)
    }
}