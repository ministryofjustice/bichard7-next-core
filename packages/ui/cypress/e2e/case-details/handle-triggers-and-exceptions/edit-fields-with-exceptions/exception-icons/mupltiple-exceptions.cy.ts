import multipleEditableFieldsExceptions from "../../../../../../test/test-data/multipleEditableFieldsExceptions.json"
import { loginAndVisit, resolveExceptionsManually } from "../../../../../support/helpers"

describe("multiple exceptions", () => {
  beforeEach(() => {
    cy.task("clearCourtCases")
  })

  it("Should not display exceptions count icon when multiple exceptions are resolved manually", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: multipleEditableFieldsExceptions.hearingOutcomeXml,
        updatedHearingOutcome: multipleEditableFieldsExceptions.updatedHearingOutcomeXml,
        errorCount: 1
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list>li").eq(0).contains("Defendant 1").should("exist")
    cy.get("ul.moj-sub-navigation__list>li").eq(3).contains("Offences 4").should("exist")

    resolveExceptionsManually()

    cy.visit("/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list>li").eq(0).contains("Defendant 1").should("not.exist")
    cy.get("ul.moj-sub-navigation__list>li").eq(3).contains("Offences 4").should("not.exist")
  })
})
