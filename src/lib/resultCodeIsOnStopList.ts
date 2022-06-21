import { STOP_LIST } from "./properties"

const resultCodeIsOnStopList = (code: number): boolean => STOP_LIST.includes(code)

export default resultCodeIsOnStopList
