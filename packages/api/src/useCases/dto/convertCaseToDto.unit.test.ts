import type { CaseRowForReport } from "@moj-bichard7/common/types/Case"

import { convertCaseToCaseReportDto } from "./convertCaseToDto"

// Don't mock sortBy or convertNoteToDto - test the actual implementation
describe("convertCaseToCaseReportDto", () => {
  it("should convert case row to case report DTO with empty notes", () => {
    const caseRow: CaseRowForReport = {
      annotated_msg: "<xml>test</xml>",
      asn: "1101ZD0100000410836J",
      court_date: new Date("2024-01-15"),
      court_name: "Test Court",
      court_reference: "REF123",
      court_room: "Room 1",
      create_ts: new Date("2024-01-10"),
      defendant_name: "John Doe",
      error_resolved_by: "user1",
      error_resolved_ts: new Date("2024-01-20"),
      notes: [],
      ptiurn: "01ZD0303208",
      trigger_resolved_by: "user2",
      trigger_resolved_ts: new Date("2024-01-21")
    }

    const result = convertCaseToCaseReportDto(caseRow)

    expect(result).toEqual({
      asn: "1101ZD0100000410836J",
      courtName: "Test Court",
      courtReference: "REF123",
      courtRoom: "Room 1",
      createdAt: new Date("2024-01-10"),
      defendantName: "John Doe",
      errorResolvedAt: new Date("2024-01-20"),
      errorResolvedBy: "user1",
      hearingDate: new Date("2024-01-15"),
      notes: [],
      ptiurn: "01ZD0303208",
      triggerResolvedAt: new Date("2024-01-21"),
      triggerResolvedBy: "user2"
    })
  })

  it("should convert case row with notes sorted by create_ts descending", () => {
    const caseRow: CaseRowForReport = {
      annotated_msg: "<xml>test</xml>",
      asn: "1101ZD0100000410836J",
      court_date: new Date("2024-01-15"),
      court_name: "Test Court",
      court_reference: "REF123",
      court_room: "Room 1",
      create_ts: new Date("2024-01-10"),
      defendant_name: "John Doe",
      error_resolved_by: "user1",
      error_resolved_ts: new Date("2024-01-20"),
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
      trigger_resolved_by: "user2",
      trigger_resolved_ts: new Date("2024-01-21")
    }

    const result = convertCaseToCaseReportDto(caseRow)

    // Notes should be sorted by create_ts descending (newest first)
    expect(result.notes).toHaveLength(3)
    expect(result.notes[0].noteText).toBe("Second note") // 2024-01-11
    expect(result.notes[1].noteText).toBe("First note") // 2024-01-10
    expect(result.notes[2].noteText).toBe("Third note") // 2024-01-09
  })

  it("should handle undefined notes", () => {
    const caseRow: CaseRowForReport = {
      annotated_msg: "<xml>test</xml>",
      asn: "1101ZD0100000410836J",
      court_date: new Date("2024-01-15"),
      court_name: "Test Court",
      court_reference: "REF123",
      court_room: "Room 1",
      create_ts: new Date("2024-01-10"),
      defendant_name: "John Doe",
      error_resolved_by: "user1",
      error_resolved_ts: new Date("2024-01-20"),
      notes: undefined as any,
      ptiurn: "01ZD0303208",
      trigger_resolved_by: "user2",
      trigger_resolved_ts: new Date("2024-01-21")
    }

    const result = convertCaseToCaseReportDto(caseRow)

    expect(result.notes).toEqual([])
  })

  it("should handle null notes", () => {
    const caseRow: CaseRowForReport = {
      annotated_msg: "<xml>test</xml>",
      asn: "1101ZD0100000410836J",
      court_date: new Date("2024-01-15"),
      court_name: "Test Court",
      court_reference: "REF123",
      court_room: "Room 1",
      create_ts: new Date("2024-01-10"),
      defendant_name: "John Doe",
      error_resolved_by: "user1",
      error_resolved_ts: new Date("2024-01-20"),
      notes: null as any,
      ptiurn: "01ZD0303208",
      trigger_resolved_by: "user2",
      trigger_resolved_ts: new Date("2024-01-21")
    }

    const result = convertCaseToCaseReportDto(caseRow)

    expect(result.notes).toEqual([])
  })

  it("should map all fields correctly", () => {
    const caseRow: CaseRowForReport = {
      annotated_msg: "<xml>test</xml>",
      asn: "ASN123",
      court_date: new Date("2024-02-01"),
      court_name: "Crown Court",
      court_reference: "CC/2024/001",
      court_room: "Court 5",
      create_ts: new Date("2024-01-25"),
      defendant_name: "Jane Smith",
      error_resolved_by: "resolver1",
      error_resolved_ts: new Date("2024-02-05"),
      notes: [],
      ptiurn: "PTI001",
      trigger_resolved_by: "resolver2",
      trigger_resolved_ts: new Date("2024-02-06")
    }

    const result = convertCaseToCaseReportDto(caseRow)

    expect(result.asn).toBe(caseRow.asn)
    expect(result.courtName).toBe(caseRow.court_name)
    expect(result.courtReference).toBe(caseRow.court_reference)
    expect(result.courtRoom).toBe(caseRow.court_room)
    expect(result.createdAt).toBe(caseRow.create_ts)
    expect(result.defendantName).toBe(caseRow.defendant_name)
    expect(result.errorResolvedAt).toBe(caseRow.error_resolved_ts)
    expect(result.errorResolvedBy).toBe(caseRow.error_resolved_by)
    expect(result.hearingDate).toBe(caseRow.court_date)
    expect(result.ptiurn).toBe(caseRow.ptiurn)
    expect(result.triggerResolvedAt).toBe(caseRow.trigger_resolved_ts)
    expect(result.triggerResolvedBy).toBe(caseRow.trigger_resolved_by)
  })
})
