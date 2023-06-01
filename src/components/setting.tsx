import { env } from '../scripts/env/env'
import './stat.css'

interface SettingArgs {
    name: keyof typeof env.settings
    value: boolean | string | number
}

function generateInput(args: SettingArgs) {

    if (args.value === true || args.value === false) {

        return (
            <form className='changeParent' action="">
                <input className="toggle waveButton" id="toggleRender" type='checkbox' defaultChecked={env.settings[args.name]} onInput={() => { env.settings[args.name] = !env.settings[args.name] }} />
                <label htmlFor='toggleRender' className='toggleLabel'>{args.name}</label>
            </form>
       )
    }

    return (
        <form className='changeParent' action="">
            <input className="changeInput" type="number" placeholder="Speed" id="newSpeed" />
            <button className="button conjoinedButton waveButton" onClick={() => env.settings[args.name]}>Change</button>
        </form>
    )
}


export default function Setting(args: SettingArgs) {

    return (
        <div className="settingsChild">

            {generateInput(args)}

        </div>
    )
}