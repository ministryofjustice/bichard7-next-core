import { parseAhoXml } from "@moj-bichard7/common/aho/parseAhoXml/index"
import { isError } from "@moj-bichard7/common/types/Result"
import getShortAsn from "@moj-bichard7/common/utils/getShortAsn"

import type { CaseRowForBailsReport } from "../../types/Reports"

import * as logic from "../cases/reports/bails/reportLogic"
import { caseToBailsReportDto } from "./caseToBailsReportDto"

jest.mock("@moj-bichard7/common/aho/parseAhoXml/index")
jest.mock("@moj-bichard7/common/types/Result")
jest.mock("@moj-bichard7/common/utils/getShortAsn")
jest.mock("../cases/reports/bails/reportLogic")

describe("caseToBailsReportDto", () => {
  let mockRow: CaseRowForBailsReport

  beforeEach(() => {
    jest.clearAllMocks()

    mockRow = {
      annotated_msg: "<xml></xml>",
      asn: "LONG_ASN",
      court_date: new Date("2023-05-10T10:00:00Z"),
      court_name: "Test Court",
      defendant_name: "John Doe",
      error_count: 0,
      msg_received_ts: new Date("2023-05-12T10:00:00Z"), // 2 days after court
      ptiurn: "12345",
      triggers: [
        { resolved_ts: null, status: 1, trigger_code: "TRPR0010" },
        { resolved_ts: new Date("2023-05-13T10:00:00Z"), status: 2, trigger_code: "TRPR0010" }
      ]
    } as CaseRowForBailsReport
    ;(isError as unknown as jest.Mock).mockImplementation((val) => val instanceof Error)
    ;(getShortAsn as jest.Mock).mockReturnValue("SHORT_ASN")
    ;(parseAhoXml as jest.Mock).mockReturnValue({ MockAho: true })
    ;(logic.aggregateOffenceData as jest.Mock).mockReturnValue({
      nextCourtDates: "15/05/2023",
      nextCourtNames: "Next Court",
      nextCourtTimes: "10:00",
      offenceTitles: "1x Theft."
    })
    ;(logic.getCaseAutomatedToPNC as jest.Mock).mockReturnValue("Yes")
    ;(logic.getBailConditionsImposed as jest.Mock).mockReturnValue("Must not contact victim")
    ;(logic.getDateOfBirth as jest.Mock).mockReturnValue("1990-12-25T00:00:00Z") // Assuming raw string for your format()
    ;(logic.getDefendantAddress as jest.Mock).mockReturnValue("123 Fake St")
    ;(logic.getHearingTime as jest.Mock).mockReturnValue("10:00")
    ;(logic.formatDate as jest.Mock).mockReturnValue("13/05/2023")
    ;(logic.getTriggerStatus as jest.Mock).mockImplementation((s) => (s === 1 ? "Unresolved" : "Resolved"))
  })

  it("should throw an error if AHO parsing fails", () => {
    const parseError = new Error("Invalid XML")
    ;(parseAhoXml as jest.Mock).mockReturnValue(parseError)
    ;(isError as unknown as jest.Mock).mockReturnValue(true)

    expect(() => [...caseToBailsReportDto(mockRow)]).toThrow("Invalid XML")
  })

  it("should generate shared data and yield one row per trigger", () => {
    const results = [...caseToBailsReportDto(mockRow)]

    expect(results).toHaveLength(2)

    const firstRow = results[0]
    expect(firstRow.asn).toBe("SHORT_ASN")
    expect(firstRow.automatedToPNC).toBe("Yes")
    expect(firstRow.bailConditions).toBe("Must not contact victim")
    expect(firstRow.courtName).toBe("Test Court")
    expect(firstRow.dateOfBirth).toBe("25/12/1990")
    expect(firstRow.defendantAddress).toBe("123 Fake St")
    expect(firstRow.defendantName).toBe("John Doe")
    expect(firstRow.hearingDate).toBe("10/05/2023")
    expect(firstRow.hearingTime).toBe("10:00")
    expect(firstRow.nextAppearanceCourt).toBe("Next Court")
    expect(firstRow.offenceTitles).toBe("1x Theft.")
    expect(firstRow.ptiurn).toBe("12345")
    expect(firstRow.receivedDate).toBe("12/05/2023 10:00")
    expect(firstRow.daysToEnterPortal).toBe(2)

    expect(results[0].triggerStatus).toBe("Unresolved")
    expect(results[1].triggerStatus).toBe("Resolved")
  })

  it("should return null for daysToEnterPortal if court_date is after msg_received_ts", () => {
    mockRow.court_date = new Date("2023-05-12T10:00:00Z")
    mockRow.msg_received_ts = new Date("2023-05-10T10:00:00Z")

    const results = [...caseToBailsReportDto(mockRow)]

    expect(results[0].daysToEnterPortal).toBeNull()
  })

  it("should handle null fallbacks gracefully", () => {
    mockRow.court_name = null as any
    mockRow.defendant_name = null as any
    mockRow.ptiurn = null as any

    const results = [...caseToBailsReportDto(mockRow)]

    expect(results[0].courtName).toBeNull()
    expect(results[0].defendantName).toBeNull()
    expect(results[0].ptiurn).toBe("")
  })
})
