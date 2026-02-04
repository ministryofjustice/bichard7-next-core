import type { CaseForReport, CaseRowForReport } from "@moj-bichard7/common/types/Reports"

import * as convertCaseModule from "../../dto/convertCaseToDto"
import { processExceptions } from "./processExceptions"

jest.mock("../../dto/convertCaseToDto")

describe("processExceptions", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should call convertCaseToCaseReportDto with the case row", () => {
    const mockCaseRow: CaseRowForReport = {
      asn: "1101ZD0100000410836J",
      court_date: new Date("2024-01-15"),
      court_name: "Test Court",
      court_reference: "REF123",
      court_room: "Room 1",
      defendant_name: "John Doe",
      msg_received_ts: new Date("2024-01-10"),
      notes: [],
      ptiurn: "01ZD0303208",
      resolved_ts: new Date("2024-01-20"),
      resolver: "user1",
      type: "error"
    }

    const mockResult: CaseForReport = {
      asn: "1101ZD0100000410836J",
      courtName: "Test Court",
      courtReference: "REF123",
      courtRoom: "Room 1",
      defendantName: "John Doe",
      hearingDate: new Date("2024-01-15"),
      messageReceivedAt: new Date("2024-01-10"),
      notes: [],
      ptiurn: "01ZD0303208",
      resolvedAt: new Date("2024-01-20"),
      resolver: "user1",
      type: "error"
    }

    jest.spyOn(convertCaseModule, "convertCaseToCaseReportDto").mockReturnValue(mockResult)

    const result = processExceptions(mockCaseRow)

    expect(convertCaseModule.convertCaseToCaseReportDto).toHaveBeenCalledWith(mockCaseRow)
    expect(convertCaseModule.convertCaseToCaseReportDto).toHaveBeenCalledTimes(1)
    expect(result).toBe(mockResult)
  })
})
