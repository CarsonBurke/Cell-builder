import { CellTypes } from "../constants"
import { AttackerCell } from "./attackerCell"
import { Cell } from "./cell"
import { CellMembrane } from "./cellMembrane"
import { CollectorCell } from "./collectorCell"
import { SolarCell } from "./solarCell"

export interface Pos {
    x: number
    y: number
}
export type Cells = Partial<{[key in CellTypes]: {[ID: string]: Cell}}>