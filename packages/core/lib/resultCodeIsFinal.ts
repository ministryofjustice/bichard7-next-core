import { lookupResultCodeByCjsCode } from "./dataLookup"

const resultCodeIsFinal = (resultCode: number): boolean =>
  lookupResultCodeByCjsCode(resultCode.toString())?.type === "F"

export default resultCodeIsFinal
