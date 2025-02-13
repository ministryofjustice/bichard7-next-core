import HO100321 from "../../../../../../test/test-data/HO100321.json"
import { clickTab, loginAndVisit } from "../../../../../support/helpers"

describe("ASN auto divide", () => {
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

  it("Should keep the cursor in right place in the input field when the character from the middle is deleted", () => {
    loginAndVisit("/bichard/court-cases/0")

    cy.get("input#asn").clear()
    cy.get("input#asn").type("1101ZD01448754K")
    cy.get("input#asn").should("have.value", "11/01ZD/01/448754K")
    cy.get("input#asn").then(($el) => ($el[0] as unknown as HTMLInputElement).setSelectionRange(5, 5))
    cy.get("input#asn").type("{backspace}")
    cy.get("input#asn").should("have.prop", "selectionStart", 4)
  })

  it("Should keep the cursor in right place in the input field when the character is added in the middle", () => {
    loginAndVisit("/bichard/court-cases/0")

    cy.get("input#asn").clear()
    cy.get("input#asn").type("1101Z01448754K")
    cy.get("input#asn").should("have.value", "11/01Z0/14/48754K")
    cy.get("input#asn").then(($el) => ($el[0] as unknown as HTMLInputElement).setSelectionRange(5, 5))
    cy.get("input#asn").type("D")
    cy.get("input#asn").should("have.prop", "selectionStart", 6)
  })

  it("Should divide ASN into sections when user types or pastes asn into the input field ", () => {
    loginAndVisit("/bichard/court-cases/0")

    cy.get("#asn").clear()
    cy.get("#asn").type("1101ZD0100000448754K")

    cy.get("#asn").should("have.value", "11/01ZD/01/00000448754K")
  })

  it("Should divide ASN into sections when user types or pastes asn into the input field ", () => {
    const asnWithoutSlashes = "1101ZD0100000448754K"
    const asnWithSlashes = "11/01ZD/01/00000448754K"

    loginAndVisit("/bichard/court-cases/0")

    cy.intercept("PUT", `/bichard/api/court-cases/0/update`).as("update")

    cy.get("input#asn").clear()
    cy.get("input#asn").type(asnWithoutSlashes)
    cy.get("input#asn").should("have.value", asnWithSlashes)

    cy.wait("@update")
    cy.get(".asn-row .success-message").contains("Input saved").should("exist")

    clickTab("Notes")
    cy.get(".notes-table")
      .find(
        `td:contains("GeneralHandler: Portal Action: Update Applied. Element: asn. New Value: ${asnWithoutSlashes}")`
      )
      .should("have.length", 1)

    clickTab("Defendant")

    cy.get("input#asn").type("{backspace}")
    cy.get("input#asn").type("K")

    cy.get("@update.all").then((interceptions) => expect(interceptions).to.have.length(1))

    clickTab("Notes")
    cy.get(".notes-table")
      .find(`td:contains("GeneralHandler: Portal Action: Update Applied. Element: asn. New Value: ${asnWithSlashes}")`)
      .should("have.length", 0)
  })
})
