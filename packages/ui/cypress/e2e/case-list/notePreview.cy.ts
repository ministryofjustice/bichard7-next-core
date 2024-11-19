import { loginAndVisit } from "../../support/helpers"

describe("Display username in note preview of latest note", () => {
  beforeEach(() => {
    cy.task("clearCourtCases")
  })

  it("Should display the username of the latest note when there is one user note", () => {
    cy.task("insertCourtCasesWithNotes", {
      caseNotes: [
        [
          { user: "GeneralHandler", text: "Test note 1", createdAt: new Date("2024-11-18") },
          { user: "System", text: "Test note 2" }
        ]
      ],
      force: "01"
    })

    loginAndVisit("Supervisor")
    cy.contains("button", "1 note").click()
    cy.contains("Note added 18/11/2024 by GeneralHandler").should("be.visible")
    cy.contains("Test note 1").should("be.visible")
  })

  it("Should display the username of the latest note when there is more than one user note", () => {
    cy.task("insertCourtCasesWithNotes", {
      caseNotes: [
        [
          { user: "GeneralHandler", text: "Test note 1", createdAt: new Date("2024-11-18") },
          { user: "Supervisor", text: "Test note 2", createdAt: new Date("2024-11-19") },
          { user: "Bichard01", text: "Test note 3", createdAt: new Date("2024-11-20") }
        ]
      ],
      force: "01"
    })

    loginAndVisit("Supervisor")
    cy.contains("button", "3 notes").click()
    cy.contains("Most recent note added 20/11/2024 by Bichard01").should("be.visible")
    cy.contains("Test note 3").should("be.visible")
  })
})
