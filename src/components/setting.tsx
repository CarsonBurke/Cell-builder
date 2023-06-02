import { env } from '../scripts/env/env'
import './stat.css'

interface SettingArgs {
    name: keyof typeof env.settings
    value: boolean | string | number
}

function textInputUpdate(args: SettingArgs) {

    const input = document.getElementById(args.name) as HTMLInputElement
    const value = input.value as never
    if (!value) {

        alert(`cannot assign ${value} to ${args.name}`)
        return
    }

    env.settings[args.name] = value
    input.placeholder = value
}

function generateInput(args: SettingArgs) {

    if (args.value === true || args.value === false) {

        return (
            <form className='changeParent flex midGap' action="">
                <input className="toggle waveButton" id={args.name} type='checkbox' defaultChecked={!!env.settings[args.name]} onInput={() => { env.settings[args.name] = !env.settings[args.name] as never }} />
                <label htmlFor={args.name} className='toggleLabel'>{args.name}</label>
            </form>
       )
    }

    const type = typeof args.value === 'number' ? 'number' : 'text'

    return (
        <form className='changeParent flex column smallGap' action="">
            <label htmlFor={args.name} id={'label' + args.name}>{args.name}</label>
            <div className="flex row">
                <input className="changeInput" type={type} placeholder={args.value.toString()} id={args.name} />
                <button className="button conjoinedButton waveButton" onClick={() => { textInputUpdate(args) } }>Change</button>
            </div>
        </form>
    )
}


export default function Setting(args: SettingArgs) {

    return (
        <div className="settingsParent">

            {generateInput(args)}

        </div>
    )
}