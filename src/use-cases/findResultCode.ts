import { resultCode } from "@moj-bichard7-developers/bichard7-next-data"
import type { ResultCode } from "@moj-bichard7-developers/bichard7-next-data/types/types"

export default (code: number): ResultCode => {
  const foundResultCode = resultCode.find((result) => result.cjsCode === code.toString()) as ResultCode

  if (!foundResultCode) {
    throw Error(`Result code ${code} not found`)
  }

  return foundResultCode
}
