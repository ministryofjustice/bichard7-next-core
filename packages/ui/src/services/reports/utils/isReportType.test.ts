import { isReportType } from "./isReportType"
import { ReportConfigs } from "types/reports/Config"

describe("isReportType", () => {
  const validTypes = Object.keys(ReportConfigs)

  test.each(validTypes)("should return true for valid report type: %s", (type) => {
    expect(isReportType(type)).toBe(true)
  })

  it("should return false for an invalid report type string", () => {
    expect(isReportType("not-a-real-report")).toBe(false)
  })

  it("should return false for case sensitive report type string", () => {
    expect(isReportType("BAILS")).toBe(false)
  })

  it("should return false for non-string inputs", () => {
    expect(isReportType(null)).toBe(false)
    expect(isReportType(undefined)).toBe(false)
    expect(isReportType(123)).toBe(false)
    expect(isReportType({})).toBe(false)
    expect(isReportType(["bails"])).toBe(false)
  })
})
