import type { CaseForExceptionReportDto } from "@moj-bichard7/common/contracts/ExceptionReport"

import getShortAsn from "@moj-bichard7/common/utils/getShortAsn"

import type { CaseRowForExceptionReport } from "../../../types/reports/Exceptions"

import { caseToExceptionsReportDto } from "./caseToExceptionsReportDto"

describe("caseToExceptionsReportDto", () => {
  it("should convert case row to case report DTO with empty notes", () => {
    const caseRow: CaseRowForExceptionReport = {
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
      type: "Exceptions"
    }

    const result = caseToExceptionsReportDto(caseRow)

    expect(result).toEqual({
      asn: "11/01ZD/01/410836J",
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
      type: "Exceptions"
    } satisfies CaseForExceptionReportDto)
  })

  it("should convert case row with notes sorted by create_ts descending", () => {
    const caseRow: CaseRowForExceptionReport = {
      asn: "1101ZD0100000410836J",
      court_date: new Date("2024-01-15"),
      court_name: "Test Court",
      court_reference: "REF123",
      court_room: "Room 1",
      defendant_name: "John Doe",
      msg_received_ts: new Date("2024-01-10"),
      notes: [
        {
          create_ts: new Date("2024-01-10T10:00:00Z"),
          error_id: 1,
          note_id: 1,
          note_text: "First note",
          user_id: "user1"
        },
        {
          create_ts: new Date("2024-01-11T10:00:00Z"),
          error_id: 1,
          note_id: 2,
          note_text: "Second note",
          user_id: "user2"
        },
        {
          create_ts: new Date("2024-01-09T10:00:00Z"),
          error_id: 1,
          note_id: 3,
          note_text: "Third note",
          user_id: "user3"
        }
      ],
      ptiurn: "01ZD0303208",
      resolved_ts: new Date("2024-01-20"),
      resolver: "user1",
      type: "Exceptions"
    }

    const result = caseToExceptionsReportDto(caseRow)

    expect(result.notes).toHaveLength(3)
    expect(result.notes[0].noteText).toBe("Second note") // 2024-01-11
    expect(result.notes[1].noteText).toBe("First note") // 2024-01-10
    expect(result.notes[2].noteText).toBe("Third note") // 2024-01-09
  })

  it("should handle undefined notes", () => {
    const caseRow: CaseRowForExceptionReport = {
      asn: "1101ZD0100000410836J",
      court_date: new Date("2024-01-15"),
      court_name: "Test Court",
      court_reference: "REF123",
      court_room: "Room 1",
      defendant_name: "John Doe",
      msg_received_ts: new Date("2024-01-10"),
      notes: undefined as any,
      ptiurn: "01ZD0303208",
      resolved_ts: new Date("2024-01-20"),
      resolver: "user1",
      type: "Triggers"
    }

    const result = caseToExceptionsReportDto(caseRow)

    expect(result.notes).toEqual([])
  })

  it("should handle null notes", () => {
    const caseRow: CaseRowForExceptionReport = {
      asn: "1101ZD0100000410836J",
      court_date: new Date("2024-01-15"),
      court_name: "Test Court",
      court_reference: "REF123",
      court_room: "Room 1",
      defendant_name: "John Doe",
      msg_received_ts: new Date("2024-01-10"),
      notes: null as any,
      ptiurn: "01ZD0303208",
      resolved_ts: new Date("2024-01-20"),
      resolver: "user1",
      type: "Exceptions"
    }

    const result = caseToExceptionsReportDto(caseRow)

    expect(result.notes).toEqual([])
  })

  it("should map all fields correctly", () => {
    const caseRow: CaseRowForExceptionReport = {
      asn: "1101ZD0100000410836J",
      court_date: new Date("2024-02-01"),
      court_name: "Crown Court",
      court_reference: "CC/2024/001",
      court_room: "Court 5",
      defendant_name: "Jane Smith",
      msg_received_ts: new Date("2024-01-25"),
      notes: [],
      ptiurn: "PTI001",
      resolved_ts: new Date("2024-02-05"),
      resolver: "resolver1",
      type: "Triggers"
    }

    const result = caseToExceptionsReportDto(caseRow)

    expect(result.asn).toBe(getShortAsn(caseRow.asn))
    expect(result.courtName).toBe(caseRow.court_name)
    expect(result.courtReference).toBe(caseRow.court_reference)
    expect(result.courtRoom).toBe(caseRow.court_room)
    expect(result.messageReceivedAt).toBe(caseRow.msg_received_ts)
    expect(result.defendantName).toBe(caseRow.defendant_name)
    expect(result.resolvedAt).toBe(caseRow.resolved_ts)
    expect(result.resolver).toBe(caseRow.resolver)
    expect(result.hearingDate).toBe(caseRow.court_date)
    expect(result.ptiurn).toBe(caseRow.ptiurn)
    expect(result.type).toBe(caseRow.type)
  })
})
