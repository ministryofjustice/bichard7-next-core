import { DisplayNote } from "types/display/Notes"
import {
  filterUserNotes,
  getMostRecentNote,
  validateMostRecentNoteDate
} from "./CaseDetailsRow/CourtCaseListEntryHelperFunction"

describe("number of notes", () => {
  it("Should filter out all the system notes and only show user entered notes", () => {
    const caseNote: DisplayNote[] = [
      {
        noteText: "This is a note created by System",
        userId: "System",
        createdAt: "2019-12-30T13:00:00.000Z"
      },
      {
        noteText: "Second note",
        userId: "coy.funk",
        createdAt: "2020-01-01T08:00:00.000Z"
      },
      {
        noteText: "Latest note",
        userId: "sonny.badger",
        createdAt: "2020-01-01T12:00:00.000Z"
      }
    ]
    const result = filterUserNotes(caseNote).length
    expect(result).toEqual(2)
  })
})

describe("getMostRecentNote Test", () => {
  it("Should return an object that contains createdAt and noteText values", () => {
    const caseNote: DisplayNote[] = [
      {
        noteText:
          "Abdullah.Fahey: Portal Action: Record Manually Resolved. Reason: PNC record already has accurate results. Reason Text:",
        userId: "tomasa.bogan",
        createdAt: "2023-02-11T10:36:11.488Z"
      }
    ]

    const recentNote = getMostRecentNote(caseNote)

    expect(recentNote).toHaveProperty("createdAt")
    expect(recentNote).toHaveProperty("noteText")
  })

  it("Should return the most recently dated note Object from many objects", () => {
    const caseNote: DisplayNote[] = [
      {
        noteText:
          "Ova.Pfeffer: Portal Action: Record Manually Resolved. Reason: Updated remand(s) manually on the PNC. Reason Text:Molestias dolor officiis placeat adipisci ea a culpa vitae.",
        userId: "gina.thiel",
        createdAt: "2022-01-01T00:00:00.000Z"
      },
      {
        noteText: "Wilson.Grady: Portal Action: Trigger Resolved. Code: TRPR0010",
        userId: "coy.funk",
        createdAt: "2023-01-01T00:00:00.000Z"
      },
      {
        noteText: "Bernie.Ankunding: Portal Action: Trigger Resolved. Code: TRPR0001",
        userId: "sonny.badger",
        createdAt: "2021-01-01T00:00:00.000Z"
      }
    ]

    const recentNote = getMostRecentNote(caseNote)
    expect(recentNote.createdAt).toBe("2023-01-01T00:00:00.000Z")
  })

  it("Should return the most recent note based off time", () => {
    const caseNote: DisplayNote[] = [
      {
        noteText: "First note",
        userId: "gina.thiel",
        createdAt: "2020-01-01T00:00:00.000Z"
      },
      {
        noteText: "Second note",
        userId: "coy.funk",
        createdAt: "2020-01-01T08:00:00.000Z"
      },
      {
        noteText: "Latest note",
        userId: "sonny.badger",
        createdAt: "2020-01-01T12:00:00.000Z"
      }
    ]

    const recentNote = getMostRecentNote(caseNote)
    expect(recentNote.createdAt).toBe("2020-01-01T12:00:00.000Z")
    expect(recentNote.noteText).toBe("Latest note")
  })

  it("Should return the correct `createdAt` date associated with the most recent note", () => {
    const caseNote: DisplayNote[] = [
      {
        noteText: "Old note",
        userId: "gina.thiel",
        createdAt: "2019-12-30T13:00:00.000Z"
      },
      {
        noteText: "Second note",
        userId: "coy.funk",
        createdAt: "2020-01-01T08:00:00.000Z"
      },
      {
        noteText: "Latest note",
        userId: "sonny.badger",
        createdAt: "2020-01-01T12:00:00.000Z"
      }
    ]

    const recentNote = getMostRecentNote(caseNote)
    const recentNoteText = recentNote.noteText
    const result = validateMostRecentNoteDate(recentNote)
    expect(recentNoteText).toBe("Latest note")
    expect(result).toBe("01/01/2020")
  })
})
