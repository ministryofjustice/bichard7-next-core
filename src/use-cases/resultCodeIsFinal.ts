import findResultCode from "./findResultCode"

const resultCodeIsFinal = (resultCode: number): boolean => findResultCode(resultCode).type === "F"

export default resultCodeIsFinal
