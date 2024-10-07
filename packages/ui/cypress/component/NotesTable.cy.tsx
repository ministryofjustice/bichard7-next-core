import { DisplayNote } from "types/display/Notes"
import { NotesTable } from "../../src/components/NotesTable"

describe("NotesTable", () => {
  it("displays provided notes", () => {
    const notes: DisplayNote[] = [
      {
        userFullName: "note user 1",
        userId: "1",
        noteText: "this is a note",
        createdAt: "Wed Oct 05 2023 16:48:00 GMT+0200"
      },
      {
        userFullName: "note user 2",
        userId: "1",
        noteText: "this is a different note",
        createdAt: "Wed Oct 06 2023 17:48:32 GMT+0200"
      }
    ]

    cy.mount(<NotesTable notes={notes} />)

    cy.contains("note user 1")
    cy.contains("this is a note")
    cy.contains("05/10/2023 15:48:00")

    cy.contains("note user 2")
    cy.contains("this is a different note")
    cy.contains("06/10/2023 16:48:32")
  })

  it("displays notes on seperate lines", () => {
    const notes: DisplayNote[] = [
      {
        userFullName: "note user 1",
        userId: "1",
        noteText: "this\r\nis\r\na\r\nnote",

        createdAt: "Wed Oct 05 2023 16:49:00 GMT+0200"
      }
    ]
    cy.mount(<NotesTable notes={notes} />)

    cy.contains("note user 1")
    cy.contains("this is a note")
    cy.contains("05/10/2023 15:49:00")
  })

  it("displays up to three user force codes", () => {
    const date = new Date().toISOString()
    const notes: DisplayNote[] = [
      {
        userFullName: "note user 1",
        userId: "1",
        noteText: "this is a note",
        user: { visibleForces: ["01"], username: "note.user1" },
        createdAt: date
      },
      {
        userFullName: "note user 2",
        userId: "1",
        noteText: "this is a different note",
        user: { visibleForces: ["01", "02", "03", "04"], username: "note.user2" },
        createdAt: date
      }
    ]

    cy.mount(<NotesTable displayForce notes={notes} />)

    cy.contains("(01)")
    cy.contains("(01, 02, 03)")
  })
})
