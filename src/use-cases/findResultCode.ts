import type ResultCode from "src/types/ResultCode"
import resultCodes from "../../data/result-codes.json"

export default (code: number): ResultCode => {
  const resultCode = (resultCodes as ResultCode[]).find((result) => result.cjsCode === code.toString()) as ResultCode

  if (!resultCode) {
    throw Error(`Result code ${code} not found`)
  }

  return resultCode
}
