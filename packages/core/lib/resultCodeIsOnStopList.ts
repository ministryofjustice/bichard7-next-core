import nonRecordableResults from "./nonRecordableResults"

const resultCodeIsOnStopList = (code: number): boolean => nonRecordableResults.includes(code)

export default resultCodeIsOnStopList
