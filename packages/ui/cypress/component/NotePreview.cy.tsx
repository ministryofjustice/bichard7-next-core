import { DisplayNote } from "types/display/Notes"
import { NotePreview } from "../../src/features/CourtCaseList/CourtCaseListEntry/CaseDetailsRow/NotePreviewButton"

describe("NotePreview", () => {
  it("should show the full text when note length is 100 characters", () => {
    const note: DisplayNote = {
      userId: "dummy.user",
      noteText: "a".repeat(100),
      createdAt: new Date().toISOString()
    }
    cy.mount(<NotePreview latestNote={note} numberOfNotes={10} />)
    cy.get("div > p:nth-child(2)").should("have.text", note.noteText)
  })

  it("should show the full text when note length is less than 100 characters", () => {
    const note: DisplayNote = {
      userId: "dummy.user",
      noteText: "a".repeat(90),
      createdAt: new Date().toISOString()
    }
    cy.mount(<NotePreview latestNote={note} numberOfNotes={10} />)
    cy.get("div > p:nth-child(2)").should("have.text", note.noteText)
  })

  it("should truncate text when note length is more than 100 characters", () => {
    const note: DisplayNote = {
      userId: "dummy.user",
      noteText: "a".repeat(110),
      createdAt: new Date().toISOString()
    }
    const expectedNoteText = "a".repeat(100) + "..."
    cy.mount(<NotePreview latestNote={note} numberOfNotes={10} />)
    cy.get("div > p:nth-child(2)").should("have.text", expectedNoteText)
  })

  it("should keep carriage return and newline chars in notes", () => {
    const note: DisplayNote = {
      userId: "dummy.user",
      noteText: "a\r\nb\r\nc",
      createdAt: new Date().toISOString()
    }

    cy.mount(<NotePreview latestNote={note} numberOfNotes={10} />)
    cy.get("div > p:nth-child(2)").should("have.text", note.noteText)
  })
})
