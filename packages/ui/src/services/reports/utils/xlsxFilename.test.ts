import type { AutomatedReportType } from "@moj-bichard7/common/types/reports/AutomatedReportType"
import { xlsxFilename } from "./xlsxFilename"

describe("xlsxFilename", () => {
  it("should return 'AutomationRate.xlsx' when the type is 'automation rate'", () => {
    const reportType: AutomatedReportType = "automation rate"
    const result = xlsxFilename(reportType)

    expect(result).toBe("AutomationRate.xlsx")
  })

  it("should return 'TopExceptions.xlsx' when the type is 'top exceptions'", () => {
    const reportType: AutomatedReportType = "top exceptions"
    const result = xlsxFilename(reportType)

    expect(result).toBe("TopExceptions.xlsx")
  })
})
