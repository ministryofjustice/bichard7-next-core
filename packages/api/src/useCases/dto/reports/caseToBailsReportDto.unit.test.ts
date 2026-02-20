import { parseAhoXml } from "@moj-bichard7/common/aho/parseAhoXml/index"
import { isError } from "@moj-bichard7/common/types/Result"
import getShortAsn from "@moj-bichard7/common/utils/getShortAsn"

import type { CaseRowForBailsReport } from "../../../types/reports/Bails"

import { bailConditionsImposed } from "../../cases/reports/bails/utils/bailConditionsImposed"
import { caseAutomatedToPNC } from "../../cases/reports/bails/utils/caseAutomatedToPNC"
import { dateOfBirth } from "../../cases/reports/utils/dateOfBirth"
import { defendantAddress } from "../../cases/reports/utils/defendantAddress"
import { formatDate } from "../../cases/reports/utils/formatDate"
import { formatOffenceData } from "../../cases/reports/utils/formatOffenceData"
import { hearingTime } from "../../cases/reports/utils/hearingTime"
import { resolutionStatusFromDb } from "../convertResolutionStatus"
import { caseToBailsReportDto } from "./caseToBailsReportDto"

jest.mock("@moj-bichard7/common/aho/parseAhoXml/index")
jest.mock("@moj-bichard7/common/types/Result")
jest.mock("@moj-bichard7/common/utils/getShortAsn")

jest.mock("../../cases/reports/bails/utils/bailConditionsImposed")
jest.mock("../../cases/reports/bails/utils/caseAutomatedToPNC")
jest.mock("../../cases/reports/utils/dateOfBirth")
jest.mock("../../cases/reports/utils/defendantAddress")
jest.mock("../../cases/reports/utils/formatDate")
jest.mock("../../cases/reports/utils/formatOffenceData")
jest.mock("../../cases/reports/utils/hearingTime")
jest.mock("../convertResolutionStatus")

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
      msg_received_ts: new Date("2023-05-12T10:00:00Z"),
      ptiurn: "12345",
      triggers: [
        { resolved_ts: null, status: 1, trigger_code: "TRPR0010" },
        { resolved_ts: new Date("2023-05-13T10:00:00Z"), status: 2, trigger_code: "TRPR0010" }
      ]
    } as unknown as CaseRowForBailsReport
    ;(parseAhoXml as jest.Mock).mockReturnValue({ MockAho: true })
    ;(isError as unknown as jest.Mock).mockImplementation((val) => val instanceof Error)
    ;(getShortAsn as jest.Mock).mockReturnValue("SHORT_ASN")
    ;(caseAutomatedToPNC as jest.Mock).mockReturnValue("Yes")
    ;(bailConditionsImposed as jest.Mock).mockReturnValue("Do not contact victim")
    ;(dateOfBirth as jest.Mock).mockReturnValue("1990-12-25T00:00:00Z")
    ;(defendantAddress as jest.Mock).mockReturnValue("123 Fake St")
    ;(hearingTime as jest.Mock).mockReturnValue("10:00")
    ;(formatOffenceData as jest.Mock).mockReturnValue({
      nextCourtDates: "15/05/2023",
      nextCourtNames: "Next Court",
      nextCourtTimes: "10:00",
      offenceTitles: "1× Theft."
    })
    ;(formatDate as jest.Mock).mockImplementation((date) => (date ? "13/05/2023" : null))
    ;(resolutionStatusFromDb as jest.Mock).mockImplementation((status) => (status === 1 ? "Unresolved" : "Resolved"))
  })

  it("should throw the error object if AHO parsing fails", () => {
    const parseError = new Error("Invalid XML Error")
    ;(parseAhoXml as jest.Mock).mockReturnValue(parseError)
    ;(isError as unknown as jest.Mock).mockReturnValue(true)

    expect(() => [...caseToBailsReportDto(mockRow)]).toThrow("Invalid XML Error")
  })

  it("should generate shared data and yield one DTO per trigger", () => {
    const results = [...caseToBailsReportDto(mockRow)]

    expect(results).toHaveLength(2)

    expect(formatOffenceData).toHaveBeenCalledWith({ MockAho: true })

    const firstRow = results[0]

    expect(firstRow.asn).toBe("SHORT_ASN")
    expect(firstRow.automatedToPNC).toBe("Yes")
    expect(firstRow.bailConditions).toBe("Do not contact victim")
    expect(firstRow.courtName).toBe("Test Court")
    expect(firstRow.dateOfBirth).toBe("25/12/1990")
    expect(firstRow.daysToEnterPortal).toBe(2)
    expect(firstRow.defendantAddress).toBe("123 Fake St")
    expect(firstRow.defendantName).toBe("John Doe")
    expect(firstRow.hearingDate).toBe("10/05/2023")
    expect(firstRow.hearingTime).toBe("10:00")
    expect(firstRow.nextAppearanceCourt).toBe("Next Court")
    expect(firstRow.nextAppearanceDate).toBe("15/05/2023")
    expect(firstRow.nextAppearanceTime).toBe("10:00")
    expect(firstRow.offenceTitles).toBe("1× Theft.")
    expect(firstRow.ptiurn).toBe("12345")
    expect(firstRow.receivedDate).toBe("12/05/2023 10:00")

    expect(results[0].triggerStatus).toBe("Unresolved")
    expect(results[0].triggerResolvedDate).toBeNull()

    expect(results[1].triggerStatus).toBe("Resolved")
    expect(results[1].triggerResolvedDate).toBe("13/05/2023")
  })

  it("should return null for daysToEnterPortal if court_date is strictly after msg_received_ts", () => {
    mockRow.court_date = new Date("2023-05-12T10:00:00Z")
    mockRow.msg_received_ts = new Date("2023-05-10T10:00:00Z")

    const results = [...caseToBailsReportDto(mockRow)]

    expect(results[0].daysToEnterPortal).toBeNull()
  })

  it("should handle null or undefined fallbacks gracefully for basic string fields", () => {
    mockRow.court_name = null as any
    mockRow.defendant_name = null as any
    mockRow.ptiurn = null as any

    const results = [...caseToBailsReportDto(mockRow)]

    expect(results[0].courtName).toBeNull()
    expect(results[0].defendantName).toBeNull()
    expect(results[0].ptiurn).toBe("")
  })

  it("should default triggerStatus to 'Unresolved' if resolutionStatusFromDb returns null/undefined", () => {
    ;(resolutionStatusFromDb as jest.Mock).mockReturnValue(undefined)

    const results = [...caseToBailsReportDto(mockRow)]

    expect(results[0].triggerStatus).toBe("Unresolved")
    expect(results[1].triggerStatus).toBe("Unresolved")
  })
})
