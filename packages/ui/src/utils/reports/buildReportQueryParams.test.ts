import type AuditResolvedBy from "@/types/AuditResolvedBy"
import type { ReportType } from "@moj-bichard7/common/types/reports/ReportType"
import { TRPR0031_RESULTS } from "@moj-bichard7/common/utils/triggerConstants"
import { buildReportQueryParams } from "./buildReportQueryParams"

describe("buildReportQueryParams", () => {
  const baseFilterValues = {
    dateFrom: "2026-01-01",
    dateTo: "2026-01-31",
    reportType: "exceptions" as ReportType,
    triggers: true,
    exceptions: true,
    resolvedBy: [] as string[],
    resultCodes: [] as string[],
    canUseTriggerAndExceptionQualityAuditing: false,
    isAutomatedReport: false,
    dateFromError: null,
    dateToError: null,
    reportTypeError: null,
    checkboxesError: null,
    resolvedByError: null,
    resultCodesError: null
  }

  const mockResolvers: AuditResolvedBy[] = [
    { username: "user1", forenames: "User 1", surname: "One", deleted: false },
    { username: "user2", forenames: "User 2", surname: "Two", deleted: false }
  ]

  it("always includes dateFrom and dateTo in query parameters", () => {
    const query = buildReportQueryParams(baseFilterValues, [])

    expect(query.get("fromDate")).toBe("2026-01-01")
    expect(query.get("toDate")).toBe("2026-01-31")
  })

  describe("when reportType is 'exceptions'", () => {
    it("includes triggers and exceptions flags as strings", () => {
      const query = buildReportQueryParams({ ...baseFilterValues, triggers: true, exceptions: false }, mockResolvers)

      expect(query.get("triggers")).toBe("true")
      expect(query.get("exceptions")).toBe("false")
    })

    it("appends individual resolvedBy parameters when only a subset is selected", () => {
      const query = buildReportQueryParams({ ...baseFilterValues, resolvedBy: ["user1"] }, mockResolvers)

      expect(query.getAll("resolvedBy")).toEqual(["user1"])
    })

    it("omits resolvedBy parameter when all resolvers are selected", () => {
      const query = buildReportQueryParams({ ...baseFilterValues, resolvedBy: ["user1", "user2"] }, mockResolvers)

      expect(query.getAll("resolvedBy")).toEqual([])
      expect(query.has("resolvedBy")).toBe(false)
    })

    it("does not include resultCodes parameters", () => {
      const query = buildReportQueryParams({ ...baseFilterValues, resultCodes: ["1030"] }, mockResolvers)

      expect(query.has("resultCodes")).toBe(false)
    })
  })

  describe("when reportType is 'community sentence'", () => {
    const communitySentenceFilterValues = {
      ...baseFilterValues,
      reportType: "community sentence" as ReportType
    }

    it("does not include triggers, exceptions, or resolvedBy parameters", () => {
      const query = buildReportQueryParams(
        {
          ...communitySentenceFilterValues,
          triggers: true,
          exceptions: true,
          resolvedBy: ["user1"]
        },
        mockResolvers
      )

      expect(query.has("triggers")).toBe(false)
      expect(query.has("exceptions")).toBe(false)
      expect(query.has("resolvedBy")).toBe(false)
    })

    it("appends individual resultCodes when a partial selection is made", () => {
      const partialCodes = [TRPR0031_RESULTS[0].id]
      const query = buildReportQueryParams(
        { ...communitySentenceFilterValues, resultCodes: partialCodes },
        mockResolvers
      )

      expect(query.getAll("resultCodes")).toEqual(partialCodes)
    })

    it("omits resultCodes when all result codes are selected", () => {
      const allCodes = TRPR0031_RESULTS.map((r) => r.id)
      const query = buildReportQueryParams({ ...communitySentenceFilterValues, resultCodes: allCodes }, mockResolvers)

      expect(query.getAll("resultCodes")).toEqual([])
      expect(query.has("resultCodes")).toBe(false)
    })
  })

  describe("when reportType is not community sentence or exceptions", () => {
    it("only includes the date range parameters", () => {
      const query = buildReportQueryParams(
        {
          ...baseFilterValues,
          reportType: "other report" as ReportType,
          triggers: true,
          exceptions: true,
          resolvedBy: ["user1"],
          resultCodes: ["1030"]
        },
        mockResolvers
      )

      const keys = Array.from(query.keys())
      expect(keys).toEqual(["fromDate", "toDate"])
    })
  })
})
