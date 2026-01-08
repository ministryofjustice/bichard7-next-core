import { ApiEndpoints } from "../types"
import { canaryCheck } from "./canaryCheck"
import { CANARY_RATIOS } from "./canaryConfig"

jest.mock("./canaryConfig", () => ({
  CANARY_RATIOS: {}
}))

describe("canaryCheck", () => {
  beforeEach(() => {
    ;(CANARY_RATIOS as any)[ApiEndpoints.CaseDetails] = undefined
    ;(CANARY_RATIOS as any)[ApiEndpoints.CaseList] = 0.5
    ;(CANARY_RATIOS as any)[ApiEndpoints.CaseResubmit] = undefined
  })

  it("should always return true when ratio is 1.0", () => {
    ;(CANARY_RATIOS as any)[ApiEndpoints.CaseDetails] = 1.0

    expect(canaryCheck(ApiEndpoints.CaseDetails, "user@example.com")).toBe(true)
    expect(canaryCheck(ApiEndpoints.CaseDetails)).toBe(true)
  })

  it("should always return false when ratio is 0.0", () => {
    ;(CANARY_RATIOS as any)[ApiEndpoints.CaseDetails] = 0.0

    expect(canaryCheck(ApiEndpoints.CaseDetails, "user@example.com")).toBe(false)
    expect(canaryCheck(ApiEndpoints.CaseDetails)).toBe(false)
  })

  it("should return consistent results for the same email", () => {
    ;(CANARY_RATIOS as any)[ApiEndpoints.CaseList] = 0.5
    const email = "user@example.com"

    const result1 = canaryCheck(ApiEndpoints.CaseList, email)
    const result2 = canaryCheck(ApiEndpoints.CaseList, email)
    expect(result1).toBe(result2)
  })

  it("should normalize emails before hashing", () => {
    ;(CANARY_RATIOS as any)[ApiEndpoints.CaseList] = 0.5
    const result1 = canaryCheck(ApiEndpoints.CaseList, "User@Example.COM")
    const result2 = canaryCheck(ApiEndpoints.CaseList, "user@example.com")
    expect(result1).toBe(result2)
  })

  it("should return random results when no email is provided", () => {
    ;(CANARY_RATIOS as any)[ApiEndpoints.CaseList] = 0.5
    const mockRandom = jest.spyOn(Math, "random")

    mockRandom.mockReturnValue(0.3)
    expect(canaryCheck(ApiEndpoints.CaseList)).toBe(true)

    mockRandom.mockReturnValue(0.7)
    expect(canaryCheck(ApiEndpoints.CaseList)).toBe(false)

    mockRandom.mockRestore()
  })
})
