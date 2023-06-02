
import { env } from '../scripts/env/env'
import './stat.css'

interface StatArgs {
    name: keyof typeof env.stats
    value: any
}

export default function Stat(args: StatArgs) {

    return (
        <div className="statsChild">

            <h3 className="statsHeader">{args.name}: </h3>
            <h3 className="statsAmount" id={args.name}>{args.value}</h3>

        </div>
    )
}