import data from "@moj-bichard7-developers/bichard7-next-data"
import type ResultCode from "src/types/ResultCode"

export default (code: number): ResultCode => {
  const resultCode = (data.resultCode as ResultCode[]).find(
    (result) => result.cjsCode === code.toString()
  ) as ResultCode

  if (!resultCode) {
    throw Error(`Result code ${code} not found`)
  }

  return resultCode
}
