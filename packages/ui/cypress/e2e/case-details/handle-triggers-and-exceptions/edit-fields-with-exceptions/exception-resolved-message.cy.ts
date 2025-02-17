import AsnExceptionHO100206 from "../../../../../test/test-data/AsnExceptionHo100206.json"
import multipleEditableFieldsExceptions from "../../../../../test/test-data/multipleEditableFieldsExceptions.json"
import { loginAndVisit, resolveExceptionsManually } from "../../../../support/helpers"

describe("Exception resolution message", () => {
  beforeEach(() => {
    cy.task("clearCourtCases")
  })

  it("displays 'Exceptions Manually resolved' when resolved manually", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: AsnExceptionHO100206.hearingOutcomeXml,
        updatedHearingOutcome: AsnExceptionHO100206.hearingOutcomeXml,
        errorCount: 1,
        errorLockedByUsername: "GeneralHandler"
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    resolveExceptionsManually()

    cy.visit("/bichard/court-cases/0")

    cy.get("#header-container .exceptions-resolved-tag").should("have.text", "ExceptionsManually Resolved")
    cy.get("#exceptions .exceptions-resolved-tag").should("have.text", "ExceptionsManually Resolved")
  })

  it("displays 'Exceptions Manually resolved' when resolved multiple exceptions manually", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: multipleEditableFieldsExceptions.hearingOutcomeXml,
        updatedHearingOutcome: multipleEditableFieldsExceptions.updatedHearingOutcomeXml,
        errorCount: 1
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    resolveExceptionsManually()

    cy.visit("/bichard/court-cases/0")

    cy.get("#header-container .exceptions-resolved-tag").should("have.text", "ExceptionsManually Resolved")
    cy.get("#exceptions .exceptions-resolved-tag").should("have.text", "ExceptionsManually Resolved")
  })

  it("displays 'Exceptions Submitted' when resubmitted the case", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: AsnExceptionHO100206.hearingOutcomeXml,
        updatedHearingOutcome: AsnExceptionHO100206.hearingOutcomeXml,
        errorCount: 1,
        errorLockedByUsername: "GeneralHandler"
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    cy.get("#asn").clear()
    cy.get("#asn").type("1101ZD0100000448754K")

    cy.get("button").contains("Submit exception(s)").click()

    cy.contains(
      "Are you sure you want to submit the amended details to the PNC and mark the exception(s) as resolved?"
    ).should("exist")
    cy.get("button").contains("Submit exception(s)").click()

    cy.get("#header-container .exceptions-submitted-tag").should("have.text", "ExceptionsSubmitted")
    cy.get("#exceptions .exceptions-submitted-tag").should("have.text", "ExceptionsSubmitted")
  })
})
