import { STOP_LIST } from "src/lib/properties"

const resultCodeIsOnStopList = (code: number): boolean => STOP_LIST.includes(code)

export default resultCodeIsOnStopList
