import nextHearingDateExceptions from "../../../../../../test/test-data/NextHearingDateExceptions.json"
import {
  clickTab,
  loginAndVisit,
  resolveExceptionsManually,
  submitAndConfirmExceptions
} from "../../../../../support/helpers"

describe("Next hearing date", () => {
  beforeEach(() => {
    cy.task("clearCourtCases")
  })

  describe("Exceptions icon", () => {
    ;[nextHearingDateExceptions.hearingOutcomeXmlHO100102, nextHearingDateExceptions.hearingOutcomeXmlHO100323].forEach(
      (exception) => {
        it("Should display 1 next to the Offences tab text when either of the next-hearing-date exceptions is raised", () => {
          cy.task("insertCourtCasesWithFields", [
            {
              orgForPoliceFilter: "01",
              hearingOutcome: exception,
              updatedHearingOutcome: exception,
              errorCount: 1
            }
          ])

          loginAndVisit("/bichard/court-cases/0")

          cy.get("ul.moj-sub-navigation__list>li").eq(3).contains("Offences").contains("1")
          cy.get("ul.moj-sub-navigation__list>li").eq(0).contains("Defendant").contains("1").should("not.exist")
          cy.get("ul.moj-sub-navigation__list>li").eq(1).contains("Hearing").contains("1").should("not.exist")
          cy.get("ul.moj-sub-navigation__list>li").eq(2).contains("Case").contains("1").should("not.exist")
          cy.get("ul.moj-sub-navigation__list>li").eq(4).contains("Notes").contains("1").should("not.exist")
        })
      }
    )
  })

  it("Should display 2 next to the Offences tab text when HO100102 and HO100323 are raised", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: nextHearingDateExceptions.hearingOutcomeXmlHO100102andHO100323,
        updatedHearingOutcome: nextHearingDateExceptions.hearingOutcomeXmlHO100102andHO100323,
        errorCount: 1
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list>li").eq(3).contains("Offences").contains("2")
    cy.get("ul.moj-sub-navigation__list>li").eq(0).contains("Defendant").contains("2").should("not.exist")
    cy.get("ul.moj-sub-navigation__list>li").eq(1).contains("Hearing").contains("2").should("not.exist")
    cy.get("ul.moj-sub-navigation__list>li").eq(2).contains("Case").contains("2").should("not.exist")
    cy.get("ul.moj-sub-navigation__list>li").eq(4).contains("Notes").contains("2").should("not.exist")
  })

  it("Should display checkmark icon next to Offences tab text when next-hearing-date exception is resolved", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: nextHearingDateExceptions.hearingOutcomeXmlHO100102,
        updatedHearingOutcome: nextHearingDateExceptions.hearingOutcomeXmlHO100102,
        errorCount: 1
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list>li").eq(3).contains("Offences").contains("1").should("exist")
    clickTab("Offences")
    cy.get(".govuk-link").contains("Offence with HO100102 - INCORRECTLY FORMATTED DATE EXCEPTION").click()
    cy.get(".hearing-result-1 #next-hearing-date").type("2026-01-01")

    submitAndConfirmExceptions()

    cy.get("ul.moj-sub-navigation__list>li").eq(3).contains("Offences").contains("1").should("not.exist")
    cy.get("ul.moj-sub-navigation__list>li").eq(3).find(".checkmark-icon").should("exist")
  })

  it("Should display checkmark icon next to Offences tab text when multiple next-hearing-date exceptions are resolved", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: nextHearingDateExceptions.hearingOutcomeXmlHO100102andHO100323,
        updatedHearingOutcome: nextHearingDateExceptions.hearingOutcomeXmlHO100102andHO100323,
        errorCount: 1
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list>li").eq(3).contains("Offences").contains("2").should("exist")
    clickTab("Offences")

    cy.get(".govuk-link").contains("Offence with HO100102 - INCORRECTLY FORMATTED DATE EXCEPTION").click()
    cy.get(".hearing-result-1 #next-hearing-date").type("2026-01-01")

    cy.get("button").contains("Next offence").click()
    cy.get(".hearing-result-1 #next-hearing-date").type("2027-01-01")

    submitAndConfirmExceptions()

    cy.get("ul.moj-sub-navigation__list>li").eq(3).contains("Offences").contains("2").should("not.exist")
    cy.get("ul.moj-sub-navigation__list>li").eq(3).find(".checkmark-icon").should("exist")
  })

  it("Should not display any icon numbers when exceptionsEnabled is false for user", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: nextHearingDateExceptions.hearingOutcomeXml,
        updatedHearingOutcome: nextHearingDateExceptions.hearingOutcomeXml,
        errorCount: 1,
        errorLockedByUsername: "GeneralHandler"
      }
    ])

    loginAndVisit("NoExceptionsFeatureFlag", "/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list>li").eq(3).contains("Offences").contains("3").should("not.exist")
  })

  it("Should not display exceptions count icon when exception is resolved manually", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: nextHearingDateExceptions.hearingOutcomeXmlHO100102,
        updatedHearingOutcome: nextHearingDateExceptions.hearingOutcomeXmlHO100102,
        errorCount: 1
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list>li").eq(3).contains("Offences 1").should("exist")

    resolveExceptionsManually()

    cy.visit("/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list>li").eq(3).contains("Offences 1").should("not.exist")
  })
})
