import nextHearingLocationExceptions from "../../../../../../test/test-data/NextHearingLocationExceptions.json"
import {
  clickTab,
  loginAndVisit,
  resolveExceptionsManually,
  submitAndConfirmExceptions
} from "../../../../../support/helpers"

describe("Next hearing location", () => {
  beforeEach(() => {
    cy.task("clearCourtCases")
  })

  describe("Exceptions icon", () => {
    ;[
      nextHearingLocationExceptions.hearingOutcomeXmlHO100200,
      nextHearingLocationExceptions.hearingOutcomeXmlHO100300,
      nextHearingLocationExceptions.hearingOutcomeXmlHO100322
    ].forEach((exception) => {
      it("Should display 1 next to the Offences tab text when either of the next-hearing-location exceptions is raised", () => {
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
    })
  })

  it("Should display 3 next to the Offences tab text when HO100200, HO100300, or HO100322 are raised", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: nextHearingLocationExceptions.hearingOutcomeXml,
        updatedHearingOutcome: nextHearingLocationExceptions.updatedHearingOutcomeXml,
        errorCount: 1,
        errorLockedByUsername: "GeneralHandler"
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list>li").eq(3).contains("Offences").contains("3")
    cy.get("ul.moj-sub-navigation__list>li").eq(0).contains("Defendant").contains("3").should("not.exist")
    cy.get("ul.moj-sub-navigation__list>li").eq(1).contains("Hearing").contains("3").should("not.exist")
    cy.get("ul.moj-sub-navigation__list>li").eq(2).contains("Case").contains("3").should("not.exist")
    cy.get("ul.moj-sub-navigation__list>li").eq(4).contains("Notes").contains("3").should("not.exist")
  })

  it("Should display checkmark icon next to Offences tab text when next-hearing-location exception is resolved", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: nextHearingLocationExceptions.hearingOutcomeXmlHO100200,
        updatedHearingOutcome: nextHearingLocationExceptions.hearingOutcomeXmlHO100200,
        errorCount: 1
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list>li").eq(3).contains("Offences").contains("1").should("exist")
    clickTab("Offences")

    cy.get(".govuk-link").contains("Offence with HO100200 - Unrecognised Force or Station Code").click()
    cy.get("#next-hearing-location").clear()
    cy.get("#next-hearing-location").type("B01EF00")

    submitAndConfirmExceptions()

    cy.get("ul.moj-sub-navigation__list>li").eq(3).contains("Offences").contains("1").should("not.exist")
    cy.get("ul.moj-sub-navigation__list>li").eq(3).find(".checkmark-icon").should("exist")
  })

  it("Should display checkmark icon next to Offences tab text when multiple next-hearing-location exceptions are resolved", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: nextHearingLocationExceptions.hearingOutcomeXml,
        updatedHearingOutcome: nextHearingLocationExceptions.updatedHearingOutcomeXml,
        errorCount: 1,
        errorLockedByUsername: "GeneralHandler"
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list>li").eq(3).contains("Offences").contains("3").should("exist")
    clickTab("Offences")

    cy.get(".govuk-link").contains("Offence with HO100200 - Unrecognised Force or Station Code").click()
    cy.get("#next-hearing-location").clear()
    cy.get("#next-hearing-location").type("B01EF00")

    cy.get("button").contains("Next offence").click()
    cy.get("#next-hearing-location").clear()
    cy.get("#next-hearing-location").type("B63AD00")

    cy.get("button").contains("Next offence").click()
    cy.get("#next-hearing-location").clear()
    cy.get("#next-hearing-location").type("C42BS00")

    submitAndConfirmExceptions()

    cy.get("ul.moj-sub-navigation__list>li").eq(3).contains("Offences").contains("3").should("not.exist")
    cy.get("ul.moj-sub-navigation__list>li").eq(3).find(".checkmark-icon").should("exist")
  })

  it("Should not display any icon numbers when exceptionsEnabled is false for user", () => {
    cy.task("clearCourtCases")

    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: nextHearingLocationExceptions.hearingOutcomeXml,
        updatedHearingOutcome: nextHearingLocationExceptions.hearingOutcomeXml,
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
        hearingOutcome: nextHearingLocationExceptions.hearingOutcomeXml,
        updatedHearingOutcome: nextHearingLocationExceptions.updatedHearingOutcomeXml,
        errorCount: 1,
        errorLockedByUsername: "GeneralHandler"
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list>li").eq(3).contains("Offences 3").should("exist")

    resolveExceptionsManually()

    cy.visit("/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list>li").eq(3).contains("Offences 3").should("not.exist")
  })
})
