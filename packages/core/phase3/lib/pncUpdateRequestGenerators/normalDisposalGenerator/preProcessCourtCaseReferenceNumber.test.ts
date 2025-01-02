import { isError } from "@moj-bichard7/common/types/Result"

import preProcessCourtCaseReferenceNumber from "./preProcessCourtCaseReferenceNumber"
describe("preProcessCourtCaseReferenceNumber", () => {
  it("should return empty string when CCR is undefined", () => {
    const result = preProcessCourtCaseReferenceNumber(undefined)

    expect(result).toBe("")
  })

  it("should return empty string when CCR is empty string", () => {
    const result = preProcessCourtCaseReferenceNumber("")

    expect(result).toBe("")
  })

  it("should return error when CCR length is less than 15 characters", () => {
    const result = preProcessCourtCaseReferenceNumber("12345678901234")

    expect(isError(result)).toBe(true)
    expect((result as Error).message).toBe("Court Case Reference Number length must be 15, but the length is 14")
  })

  it("should return error when CCR length is more than 15 characters", () => {
    const result = preProcessCourtCaseReferenceNumber("1234567123456789")

    expect(isError(result)).toBe(true)
    expect((result as Error).message).toBe("Court Case Reference Number length must be 15, but the length is 16")
  })

  it("should return processed CCR when CCR is valid", () => {
    const result = preProcessCourtCaseReferenceNumber("97/1626/468395Q")

    expect(result).toBe("97/1626/468395Q")
  })

  it("should remove leading zeros from the sequential number part of the CCR", () => {
    const sequentialNumber = "008395"
    const ccr = `97/1626/${sequentialNumber}Q`
    const result = preProcessCourtCaseReferenceNumber(ccr)

    expect(result).toBe("97/1626/8395Q")
  })
})
