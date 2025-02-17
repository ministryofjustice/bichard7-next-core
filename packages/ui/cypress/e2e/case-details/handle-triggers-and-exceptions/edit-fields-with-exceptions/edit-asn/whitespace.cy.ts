import HO100321 from "../../../../../../test/test-data/HO100321.json"
import { loginAndVisit } from "../../../../../support/helpers"

describe("ASN handles whitespace", () => {
  beforeEach(() => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: HO100321.hearingOutcomeXml,
        updatedHearingOutcome: HO100321.hearingOutcomeXml,
        errorCount: 1,
        errorLockedByUsername: "GeneralHandler"
      }
    ])
  })

  it("Should handle whitespace", () => {
    loginAndVisit("/bichard/court-cases/0")

    cy.get("#asn").clear()
    cy.get("#asn").invoke("val", " 11/01ZD/01/448754K  ").type("{backspace}")

    cy.get("#asn").should("have.value", "11/01ZD/01/448754K")

    cy.get(".asn-row .success-message").contains("Input saved").should("exist")
  })

  it("Should handle whitespace pasted", () => {
    loginAndVisit("/bichard/court-cases/0")

    cy.get("#asn").clear()
    cy.get("#asn").trigger("paste", { clipboardData: { getData: () => " 11/01ZD/01/448754K  " } })

    cy.get("#asn").should("have.value", "11/01ZD/01/448754K")

    cy.get(".asn-row .success-message").contains("Input saved").should("exist")
  })
})
