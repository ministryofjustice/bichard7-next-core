import { DisplayNote } from "types/display/Notes"

import { NotesTable } from "../../src/components/NotesTable"

describe("NotesTable", () => {
  it("displays provided notes", () => {
    const notes: DisplayNote[] = [
      {
        createdAt: "Wed Oct 05 2023 16:48:00 GMT+0200",
        noteText: "this is a note",
        userFullName: "note user 1",
        userId: "1"
      },
      {
        createdAt: "Wed Oct 06 2023 17:48:32 GMT+0200",
        noteText: "this is a different note",
        userFullName: "note user 2",
        userId: "1"
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
        createdAt: "Wed Oct 05 2023 16:49:00 GMT+0200",
        noteText: "this\r\nis\r\na\r\nnote",
        userFullName: "note user 1",

        userId: "1"
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
        createdAt: date,
        noteText: "this is a note",
        user: { username: "note.user1", visibleForces: ["01"] },
        userFullName: "note user 1",
        userId: "1"
      },
      {
        createdAt: date,
        noteText: "this is a different note",
        user: { username: "note.user2", visibleForces: ["01", "02", "03", "04"] },
        userFullName: "note user 2",
        userId: "1"
      }
    ]

    cy.mount(<NotesTable displayForce notes={notes} />)

    cy.contains("(01)")
    cy.contains("(01, 02, 03)")
  })
})
