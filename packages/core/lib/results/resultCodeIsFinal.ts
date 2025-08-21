import { lookupResultCodeByCjsCode } from "@moj-bichard7/common/aho/dataLookup/index"

const resultCodeIsFinal = (resultCode: number): boolean =>
  lookupResultCodeByCjsCode(resultCode.toString())?.type === "F"

export default resultCodeIsFinal
