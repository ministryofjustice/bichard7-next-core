import HO100206 from "../../../../../../test/test-data/HO100206.json"
import { clickTab, loginAndVisit, verifyUpdatedMessage } from "../../../../../support/helpers"

describe("ASN auto saves", () => {
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

  it("Should display an error message when auto-save fails", () => {
    cy.intercept("PUT", "/bichard/api/court-cases/0/update", {
      statusCode: 500
    })

    loginAndVisit("/bichard/court-cases/0")

    cy.get("#asn").clear()
    cy.get("#asn").type("1101ZD0100000410836V")
    cy.get(".asn-row .error-message").contains("Autosave has failed, please refresh").should("exist")
    cy.get(".asn-row .success-message").should("not.exist")
  })

  it("Should validate and auto-save the ASN correction", () => {
    cy.intercept("PUT", "/bichard/api/court-cases/0/update").as("save")

    loginAndVisit("/bichard/court-cases/0")

    cy.get("#asn").type("AAAAAAAAAAAAAAAAAAAA")
    cy.get(".asn-row .error-message").should("exist")

    cy.get("button").contains("Submit exception(s)").should("be.enabled")
    cy.get("#asn").clear()

    cy.get("#asn").type("1101ZD0100000410836V")
    cy.get(".asn-row .success-message").contains("Input saved").should("exist")
    cy.get("button").contains("Submit exception(s)").should("be.enabled")

    cy.wait("@save")
    verifyUpdatedMessage({
      expectedCourtCase: { errorId: 0, errorStatus: "Unresolved" },
      updatedMessageNotHaveContent: ["<br7:ArrestSummonsNumber>1101ZD0100000448754K</br7:ArrestSummonsNumber>"],
      updatedMessageHaveContent: ["<br7:ArrestSummonsNumber>1101ZD0100000410836V</br7:ArrestSummonsNumber>"]
    })
  })

  it("Should validate and auto-save the ASN correction and update notes", () => {
    const errorId = 0
    const updatedAsn = "1101ZD0100000410836V"

    cy.intercept("PUT", `/bichard/api/court-cases/${errorId}/update`).as("save")

    loginAndVisit(`/bichard/court-cases/${errorId}`)

    cy.get("#asn").type("AAAAAAAAAAAAAAAAAAAA")
    cy.get(".asn-row .error-message").should("exist")
    cy.get(".asn-row .error-message").contains("Enter ASN in the correct format")

    cy.get("button").contains("Submit exception(s)").should("be.enabled")
    cy.get("#asn").clear()

    cy.get("#asn").type(updatedAsn)

    cy.wait("@save")

    cy.get(".asn-row .success-message").contains("Input saved").should("exist")
    cy.get("button").contains("Submit exception(s)").should("be.enabled")

    cy.get("@save").its("response.body.courtCase.errorId").should("eq", errorId)
    cy.get("@save")
      .its(
        "response.body.courtCase.updatedHearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber"
      )
      .should("eq", updatedAsn)

    clickTab("Notes")
    cy.get("td").contains(`GeneralHandler: Portal Action: Update Applied. Element: asn. New Value: ${updatedAsn}`)
  })
})
