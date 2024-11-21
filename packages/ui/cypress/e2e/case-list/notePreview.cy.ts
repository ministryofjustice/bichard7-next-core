import { loginAndVisit } from "../../support/helpers"

describe("Note preview", () => {
  beforeEach(() => {
    cy.task("clearCourtCases")
  })

  it("Should display the username of the latest note when there is one user note", () => {
    cy.task("insertCourtCasesWithNotes", {
      caseNotes: [
        [
          { createdAt: new Date("2024-11-18"), text: "Test note 1", user: "GeneralHandler" },
          { text: "Test note 2", user: "System" }
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
          { createdAt: new Date("2024-11-18"), text: "Test note 1", user: "GeneralHandler" },
          { createdAt: new Date("2024-11-19"), text: "Test note 2", user: "Supervisor" },
          { createdAt: new Date("2024-11-20"), text: "Test note 3", user: "Bichard01" }
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
