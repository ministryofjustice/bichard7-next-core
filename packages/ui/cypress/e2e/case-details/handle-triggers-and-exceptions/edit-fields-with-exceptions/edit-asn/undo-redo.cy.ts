import HO100206 from "../../../../../../test/test-data/HO100206.json"
import { loginAndVisit } from "../../../../../support/helpers"

describe("Undo/Redo", () => {
  beforeEach(() => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: HO100206.hearingOutcomeXml,
        updatedHearingOutcome: HO100206.hearingOutcomeXml,
        errorCount: 1,
        errorLockedByUsername: "GeneralHandler"
      }
    ])
  })

  it("can undo (ctrl + z)", () => {
    loginAndVisit("/bichard/court-cases/0")

    cy.get("#asn").clear()
    cy.get("#asn").type("11/01ZD/01/4", { delay: 50 })

    cy.get("#asn").should("have.value", "11/01ZD/01/4")

    // undo
    cy.get("#asn").type("{ctrl+z}{ctrl+z}{ctrl+z}", { delay: 50 })
    cy.get("#asn").should("have.value", "11/01ZD/")
  })

  it("can redo (shift + ctrl + z)", () => {
    loginAndVisit("/bichard/court-cases/0")

    cy.get("#asn").clear()
    cy.get("#asn").type("11/01ZD/01/4", { delay: 50 })

    cy.get("#asn").should("have.value", "11/01ZD/01/4")

    // undo
    cy.get("#asn").type("{ctrl+z}{ctrl+z}{ctrl+z}", { delay: 50 })
    cy.get("#asn").should("have.value", "11/01ZD/")
    // redo
    cy.get("#asn").type("{shift+ctrl+z}{shift+ctrl+z}{shift+ctrl+z}", { delay: 50 })
    cy.get("#asn").should("have.value", "11/01ZD/01/4")
  })

  it("can redo (ctrl + y)", () => {
    loginAndVisit("/bichard/court-cases/0")

    cy.get("#asn").clear()
    cy.get("#asn").type("11/01ZD/01/4", { delay: 50 })

    cy.get("#asn").should("have.value", "11/01ZD/01/4")

    // undo
    cy.get("#asn").type("{ctrl+z}{ctrl+z}{ctrl+z}", { delay: 50 })
    cy.get("#asn").should("have.value", "11/01ZD/")
    // redo
    cy.get("#asn").type("{ctrl+y}{ctrl+y}{ctrl+y}", { delay: 50 })
    cy.get("#asn").should("have.value", "11/01ZD/01/4")
  })
})
