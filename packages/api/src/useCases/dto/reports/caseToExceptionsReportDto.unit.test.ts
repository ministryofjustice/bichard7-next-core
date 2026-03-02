import type { CaseForExceptionReportDto } from "@moj-bichard7/common/types/reports/Exceptions"

import type { CaseRowForExceptionReport } from "../../../types/reports/Exceptions"

import { caseToExceptionsReportDto } from "./caseToExceptionsReportDto"

describe("caseToExceptionsReportDto", () => {
  const baseCaseRow: CaseRowForExceptionReport = {
    asn: "1101ZD0100000410836J",
    court_date: new Date("2024-01-15"),
    court_name: "Test Court",
    court_reference: "REF123",
    court_room: "Room 1",
    defendant_name: "John Doe",
    msg_received_ts: new Date("2024-01-10T12:00:00Z"),
    notes: [],
    ptiurn: "01ZD0303208",
    resolved_ts: new Date("2024-01-20T15:30:00Z"),
    resolver: "user1",
    type: "Exceptions"
  }

  it("should convert case row to report DTO and format dates as strings", () => {
    const result = caseToExceptionsReportDto(baseCaseRow)

    expect(result).toEqual({
      asn: "11/01ZD/01/410836J",
      courtName: "Test Court",
      courtReference: "REF123",
      courtRoom: "Room 1",
      defendantName: "John Doe",
      hearingDate: "15/01/2024",
      messageReceivedAt: "10/01/2024 12:00", // Matches your Received output
      notes: "",
      ptiurn: "01ZD0303208",
      resolutionAction: "",
      resolvedAt: "20/01/2024 15:30", // Matches your Received output
      resolver: "user1",
      type: "Ex"
    } satisfies CaseForExceptionReportDto)
  })

  it("should format multiple notes into a single newline-separated string in DB order", () => {
    const caseRow: CaseRowForExceptionReport = {
      ...baseCaseRow,
      notes: [
        {
          create_ts: new Date("2024-01-10T10:00:00Z"),
          error_id: 1,
          note_id: 1,
          note_text: "First note",
          user_id: "user1"
        },
        {
          create_ts: new Date("2024-01-11T14:00:00Z"),
          error_id: 1,
          note_id: 2,
          note_text: "Second note",
          user_id: "user2"
        }
      ]
    }

    const result = caseToExceptionsReportDto(caseRow)

    const expectedNotes = "First note [user1 10/01/2024 10:00]\n\n" + "Second note [user2 11/01/2024 14:00]"

    expect(result.notes).toBe(expectedNotes)
  })

  describe("resolutionAction logic", () => {
    it("should set resolutionAction to 'Trigger activity performed' for Trigger types", () => {
      const caseRow = { ...baseCaseRow, type: "Trigger" }
      const result = caseToExceptionsReportDto(caseRow)
      expect(result.resolutionAction).toBe("Trigger activity performed")
      expect(result.type).toBe("Tr")
    })

    it("should identify 'Resolved via re-submission' from notes", () => {
      const caseRow: CaseRowForExceptionReport = {
        ...baseCaseRow,
        notes: [
          {
            create_ts: new Date(),
            error_id: 1,
            note_id: 1,
            note_text: "System generated: Portal Action: Resubmitted Message",
            user_id: "System"
          }
        ],
        type: "Exceptions"
      }
      const result = caseToExceptionsReportDto(caseRow)
      expect(result.resolutionAction).toBe("Resolved via re-submission")
    })

    it("should extract manual resolution reason and reason text", () => {
      const caseRow: CaseRowForExceptionReport = {
        ...baseCaseRow,
        notes: [
          {
            create_ts: new Date(),
            error_id: 1,
            note_id: 1,
            note_text: "Portal Action: Record Manually Resolved. Reason: Postponed Reason Text: Awaiting documents",
            user_id: "user1"
          }
        ],
        type: "Exceptions"
      }
      const result = caseToExceptionsReportDto(caseRow)
      expect(result.resolutionAction).toBe("Postponed (Awaiting documents)")
    })

    it("should use the most recent resolution note (right-most in chronologically ordered array)", () => {
      const caseRow: CaseRowForExceptionReport = {
        ...baseCaseRow,
        notes: [
          {
            create_ts: new Date("2024-01-01"),
            error_id: 1,
            note_id: 1,
            note_text: "Portal Action: Resubmitted Message",
            user_id: "sys"
          },
          {
            create_ts: new Date("2024-01-02"),
            error_id: 1,
            note_id: 2,
            note_text: "Portal Action: Record Manually Resolved. Reason: Finished",
            user_id: "user1"
          }
        ]
      }
      const result = caseToExceptionsReportDto(caseRow)
      expect(result.resolutionAction).toBe("Finished")
    })
  })

  it("should handle null or undefined notes gracefully", () => {
    const caseRow = { ...baseCaseRow, notes: null as any }
    const resultNull = caseToExceptionsReportDto(caseRow)
    expect(resultNull.notes).toBe("")

    const caseRowUndefined = { ...baseCaseRow, notes: undefined as any }
    const resultUndefined = caseToExceptionsReportDto(caseRowUndefined)
    expect(resultUndefined.notes).toBe("")
  })
})
