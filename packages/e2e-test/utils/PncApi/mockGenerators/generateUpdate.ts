import type { PartialPncMock, PncMockOptions } from "../../../types/PncMock"
import convertToXml from "../../converters/convertJsonToXml"
import generateResponse from "../generateResponse"

export const generateUpdate = (code: string, options?: PncMockOptions): PartialPncMock => {
  const response = generateResponse(code, options?.response)
  const expectedRequest =
    typeof options?.expectedRequest === "object"
      ? convertToXml(code, options?.expectedRequest)
      : options?.expectedRequest || ""

  return {
    matchRegex: options?.matchRegex || code,
    response,
    expectedRequest,
    count: options?.count || undefined
  }
}
