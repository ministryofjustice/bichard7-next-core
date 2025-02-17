import HO100206 from "../../../../../../test/test-data/HO100206.json"
import HO100301 from "../../../../../../test/test-data/HO100301.json"
import HO100321 from "../../../../../../test/test-data/HO100321.json"

import { loginAndVisit, resolveExceptionsManually, submitAndConfirmExceptions } from "../../../../../support/helpers"

function asnExceptionDisplaysDefendantTabIcon(exception: { hearingOutcomeXml: string }) {
  cy.task("insertCourtCasesWithFields", [
    {
      orgForPoliceFilter: "01",
      hearingOutcome: exception.hearingOutcomeXml,
      updatedHearingOutcome: exception.hearingOutcomeXml,
      errorCount: 1,
      errorLockedByUsername: "GeneralHandler"
    }
  ])

  loginAndVisit("/bichard/court-cases/0")

  cy.get("ul.moj-sub-navigation__list>li").eq(0).contains("Defendant").contains("1")
  cy.get("ul.moj-sub-navigation__list>li").eq(1).contains("Hearing").contains("1").should("not.exist")
  cy.get("ul.moj-sub-navigation__list>li").eq(2).contains("Case").contains("1").should("not.exist")
  cy.get("ul.moj-sub-navigation__list>li").eq(3).contains("Offences").contains("1").should("not.exist")
  cy.get("ul.moj-sub-navigation__list>li").eq(4).contains("Notes").contains("1").should("not.exist")
}

describe("ASN exception", () => {
  beforeEach(() => {
    cy.task("clearCourtCases")
  })

  it("Should display 1 next to Defendant tab text when HO100206 is raised", () => {
    asnExceptionDisplaysDefendantTabIcon(HO100206)
  })

  it("Should display 1 next to Defendant tab text when HO100301 is raised", () => {
    asnExceptionDisplaysDefendantTabIcon(HO100301)
  })

  it("Should display 1 next to Defendant tab text when HO100321 is raised", () => {
    asnExceptionDisplaysDefendantTabIcon(HO100321)
  })

  it("Should display checkmark icon next to Defendant tab text when asn exception is resolved", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: HO100206.hearingOutcomeXml,
        updatedHearingOutcome: HO100206.hearingOutcomeXml,
        errorCount: 1,
        errorLockedByUsername: "GeneralHandler"
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    cy.get("#asn").clear()
    cy.get("#asn").type("1101ZD0100000448754K")

    submitAndConfirmExceptions()

    cy.get("ul.moj-sub-navigation__list>li").eq(0).contains("Defendant").contains("1").should("not.exist")
    cy.get("ul.moj-sub-navigation__list>li").eq(0).find(".checkmark-icon").should("exist")
  })

  it("Should not display exceptions count icon when exception is resolved manually", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: HO100206.hearingOutcomeXml,
        updatedHearingOutcome: HO100206.hearingOutcomeXml,
        errorCount: 1
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list>li").eq(0).contains("Defendant 1").should("exist")

    resolveExceptionsManually()

    cy.visit("/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list>li").eq(0).contains("Defendant 1").should("not.exist")
  })
})
