import multipleHearingResultsOnOffence from "../../../../../../test/test-data/multipleHearingResultsOnOffence.json"
import nextHearingDateAndLocationExceptions from "../../../../../../test/test-data/NextHearingDateAndLocationExceptions.json"
import nextHearingDateExceptions from "../../../../../../test/test-data/NextHearingDateExceptions.json"
import nextHearingLocationExceptions from "../../../../../../test/test-data/NextHearingLocationExceptions.json"
import {
  clickTab,
  loginAndVisit,
  resolveExceptionsManually,
  submitAndConfirmExceptions
} from "../../../../../support/helpers"
import offenceMatchingException from "../../../offence-matching/fixtures/HO100310.json"

describe("Offences exceptions icons", () => {
  it("Should display a warning icon in front of the first offence when exception is raised and checkmark icon when exception is resolved", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: nextHearingDateExceptions.hearingOutcomeXmlHO100102,
        updatedHearingOutcome: nextHearingDateExceptions.hearingOutcomeXmlHO100102,
        errorCount: 1,
        errorLockedByUsername: "GeneralHandler"
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    clickTab("Offences")
    cy.get("#offences tbody tr:nth-child(1)").find(".warning-icon").should("exist")
    cy.get("#offences tbody tr:nth-child(1)").find(".checkmark-icon").should("not.exist")
    cy.get(".govuk-link").contains("Offence with HO100102 - INCORRECTLY FORMATTED DATE EXCEPTION").click()
    cy.get(".hearing-result-1 #next-hearing-date").type("2028-01-01")

    submitAndConfirmExceptions()

    clickTab("Offences")
    cy.get("#offences tbody tr:nth-child(1)").find(".warning-icon").should("not.exist")
    cy.get("#offences tbody tr:nth-child(1)").find(".checkmark-icon").should("exist")
  })

  it("Should display warning icons for the first and second offences when exceptions are raised. Once the exceptions for these offences are resolved, replace the warning icons with checkmark icons", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: nextHearingDateExceptions.hearingOutcomeXml,
        updatedHearingOutcome: nextHearingDateExceptions.updatedHearingOutcomeXml,
        errorCount: 1
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    clickTab("Offences")
    cy.get("#offences tbody tr:nth-child(1)").find(".warning-icon").should("exist")
    cy.get("#offences tbody tr:nth-child(1) td:nth-child(1) .warning-icon").should("have.length", 1)

    cy.get("#offences tbody tr:nth-child(2)").find(".warning-icon").should("exist")
    cy.get("#offences tbody tr:nth-child(2) td:nth-child(1) .warning-icon").should("have.length", 1)

    cy.get("#offences tbody tr:nth-child(3)").find(".warning-icon").should("not.exist")

    cy.get(".govuk-link").contains("Offence with HO100102 - INCORRECTLY FORMATTED DATE EXCEPTION").click()
    cy.get(".hearing-result-1 #next-hearing-date").type("2026-01-01")
    cy.get(".hearing-result-2 #next-hearing-date").type("2026-01-01")

    cy.get("button").contains("Next offence").click()

    cy.get("#next-hearing-location").clear()
    cy.get("#next-hearing-location").type("B01EF00")
    cy.get(".hearing-result-1 #next-hearing-date").type("2026-01-01")

    submitAndConfirmExceptions()

    clickTab("Offences")
    cy.get("#offences tbody tr:nth-child(1)").find(".warning-icon").should("not.exist")
    cy.get("#offences tbody tr:nth-child(1)").find(".checkmark-icon").should("exist")
    cy.get("#offences tbody tr:nth-child(1) td:nth-child(1) .checkmark-icon").should("have.length", 1)

    cy.get("#offences tbody tr:nth-child(2)").find(".warning-icon").should("not.exist")
    cy.get("#offences tbody tr:nth-child(2)").find(".checkmark-icon").should("exist")
    cy.get("#offences tbody tr:nth-child(1) td:nth-child(1) .checkmark-icon").should("have.length", 1)

    cy.get("#offences tbody tr:nth-child(3)").find(".warning-icon").should("not.exist")
    cy.get("#offences tbody tr:nth-child(3)").find(".checkmark-icon").should("not.exist")
  })

  it("Should display only one warning icon per offence", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: nextHearingDateAndLocationExceptions.hearingOutcomeXml,
        updatedHearingOutcome: nextHearingDateAndLocationExceptions.hearingOutcomeXml,
        errorCount: 1
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    clickTab("Offences")
    cy.get("#offences tbody tr:nth-child(1)").find(".warning-icon").should("not.exist")

    cy.get("#offences tbody tr:nth-child(2)").find(".warning-icon").should("exist")
    cy.get("#offences tbody tr:nth-child(2) td:nth-child(1) .warning-icon").should("have.length", 1)
  })

  it("Should display warning icon when only one of the exceptions is resolved for that particular offence", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: nextHearingDateAndLocationExceptions.hearingOutcomeXml,
        updatedHearingOutcome: nextHearingDateAndLocationExceptions.hearingOutcomeXml,
        errorCount: 1
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    clickTab("Offences")
    cy.get("#offences tbody tr:nth-child(1)").find(".warning-icon").should("not.exist")

    cy.get("#offences tbody tr:nth-child(2)").find(".warning-icon").should("exist")
    cy.get("#offences tbody tr:nth-child(2) td:nth-child(1) .warning-icon").should("have.length", 1)

    cy.get(".govuk-link")
      .contains("Offence with HO100323 - COURT HAS PROVIDED AN ADJOURNMENT WITH NO NEXT HEARING DATE EXCEPTION")
      .click()
    cy.get("#next-hearing-location").clear()
    cy.get("#next-hearing-location").type("B01EF00")
    cy.get(".hearing-result-1 #next-hearing-date").type("2027-01-01")
    submitAndConfirmExceptions()

    clickTab("Offences")
    cy.get("#offences tbody tr:nth-child(2) td:nth-child(1) .warning-icon").should("not.exist")
    cy.get("#offences tbody tr:nth-child(2) td:nth-child(1) .checkmark-icon").should("exist")
    cy.get("#offences tbody tr:nth-child(2) td:nth-child(1) .checkmark-icon").should("have.length", 1)
  })

  it("Should display warning icon until all of the exceptions are resolved on a case with multiple hearing location exceptions", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: nextHearingLocationExceptions.nextHearingLocationExceptionOnMultipleResults,
        updatedHearingOutcome: nextHearingLocationExceptions.nextHearingLocationExceptionOnMultipleResults,
        errorCount: 1
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    clickTab("Offences")
    cy.get("#offences tbody tr:nth-child(1)").find(".warning-icon").should("exist")

    cy.get(".govuk-link").contains("Offence with HO100200 - Unrecognised Force or Station Code").click()
    cy.get(".hearing-result-1 #next-hearing-location").type("B01EF00")

    cy.get("a.govuk-back-link").contains("Back to all offences").click()
    cy.get("#offences tbody tr:nth-child(1)").find(".warning-icon").should("exist")

    cy.get(".govuk-link").contains("Offence with HO100200 - Unrecognised Force or Station Code").click()
    cy.get(".hearing-result-2 #next-hearing-location").type("C04BF00")

    cy.get("a.govuk-back-link").contains("Back to all offences").click()
    cy.get("#offences tbody tr:nth-child(1)").find(".warning-icon").should("not.exist")
    cy.get("#offences tbody tr:nth-child(1)").find(".checkmark-icon").should("exist")
  })

  it("Should display warning and checkmark icons correctly when court offence sequence number is out of order", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: multipleHearingResultsOnOffence.hearingOutcomeWithCourtOffenceSequenceOutOfOrder,
        updatedHearingOutcome: multipleHearingResultsOnOffence.hearingOutcomeWithCourtOffenceSequenceOutOfOrder,
        errorCount: 1
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    clickTab("Offences")
    cy.get("#offences tbody tr:nth-child(1)").find(".warning-icon").should("exist")
    cy.get("#offences tbody tr:nth-child(2)").find(".warning-icon").should("exist")
    cy.get("#offences tbody tr:nth-child(3)").find(".warning-icon").should("exist")
    cy.get("#offences tbody tr:nth-child(4)").find(".warning-icon").should("not.exist")

    cy.get(".govuk-link").contains("Offence with HO100200 - Unrecognised Force or Station Code").click()
    cy.get(".hearing-result-1 #next-hearing-location").type("B01EF00")
    cy.get(".hearing-result-2 #next-hearing-location").type("C04BF00")

    cy.get("a.govuk-back-link").contains("Back to all offences").click()
    cy.get("#offences tbody tr:nth-child(1)").find(".warning-icon").should("not.exist")
    cy.get("#offences tbody tr:nth-child(1)").find(".checkmark-icon").should("exist")

    cy.get(".govuk-link").contains("Offence with HO100300 - Organisation not recognised").click()
    cy.get(".hearing-result-1 #next-hearing-location").type("B01EF00")

    cy.get("a.govuk-back-link").contains("Back to all offences").click()
    cy.get("#offences tbody tr:nth-child(2)").find(".warning-icon").should("not.exist")
    cy.get("#offences tbody tr:nth-child(2)").find(".checkmark-icon").should("exist")

    cy.get(".govuk-link")
      .contains("Offence with HO100322 - Court has provided an adjournment with no location for the next hearing")
      .click()
    cy.get(".hearing-result-1 #next-hearing-location").type("B01EF00")

    cy.get("a.govuk-back-link").contains("Back to all offences").click()
    cy.get("#offences tbody tr:nth-child(3)").find(".warning-icon").should("not.exist")
    cy.get("#offences tbody tr:nth-child(3)").find(".checkmark-icon").should("exist")
  })

  it("Should display warning icon until all of the exceptions are resolved on a case with multiple hearing date exceptions", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: nextHearingDateExceptions.hearingOutcomeXml,
        updatedHearingOutcome: nextHearingDateExceptions.hearingOutcomeXml,
        errorCount: 1
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    clickTab("Offences")
    cy.get("#offences tbody tr:nth-child(1)").find(".warning-icon").should("exist")

    cy.get(".govuk-link").contains("Offence with HO100102 - INCORRECTLY FORMATTED DATE EXCEPTION").click()
    cy.get(".hearing-result-1 #next-hearing-date").type("2027-01-01")

    cy.get("a.govuk-back-link").contains("Back to all offences").click()
    cy.get("#offences tbody tr:nth-child(1)").find(".warning-icon").should("exist")

    cy.get(".govuk-link").contains("Offence with HO100102 - INCORRECTLY FORMATTED DATE EXCEPTION").click()
    cy.get(".hearing-result-2 #next-hearing-date").type("2028-02-02")

    cy.get("a.govuk-back-link").contains("Back to all offences").click()
    cy.get("#offences tbody tr:nth-child(1)").find(".warning-icon").should("not.exist")
    cy.get("#offences tbody tr:nth-child(1)").find(".checkmark-icon").should("exist")
  })

  it("Should display warning icon until all of the exceptions are resolved on a case with multiple exceptions on multiple hearing results", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome:
          nextHearingDateAndLocationExceptions.multipleNextHearingDateAndLocationExceptionsWithMultipleHearingResults,
        updatedHearingOutcome:
          nextHearingDateAndLocationExceptions.multipleNextHearingDateAndLocationExceptionsWithMultipleHearingResults,
        errorCount: 1
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    clickTab("Offences")
    cy.get("#offences tbody tr:nth-child(2)").find(".warning-icon").should("exist")

    cy.get(".govuk-link").contains("Offence with multiple exceptions on multiple results").click()

    cy.get(".hearing-result-1 #next-hearing-date").type("2027-01-01")

    cy.get("a.govuk-back-link").contains("Back to all offences").click()
    cy.get("#offences tbody tr:nth-child(2)").find(".warning-icon").should("exist")

    cy.get(".govuk-link").contains("Offence with multiple exceptions on multiple results").click()

    cy.get(".hearing-result-1 #next-hearing-location").type("B01EF00")
    cy.get("a.govuk-back-link").contains("Back to all offences").click()
    cy.get("#offences tbody tr:nth-child(2)").find(".warning-icon").should("exist")

    cy.get(".govuk-link").contains("Offence with multiple exceptions on multiple results").click()

    cy.get(".hearing-result-2 #next-hearing-date").type("2027-01-01")

    cy.get("a.govuk-back-link").contains("Back to all offences").click()
    cy.get("#offences tbody tr:nth-child(2)").find(".warning-icon").should("exist")

    cy.get(".govuk-link").contains("Offence with multiple exceptions on multiple results").click()

    cy.get(".hearing-result-2 #next-hearing-location").type("B01EF00")
    cy.get("a.govuk-back-link").contains("Back to all offences").click()
    cy.get("#offences tbody tr:nth-child(2)").find(".warning-icon").should("not.exist")
    cy.get("#offences tbody tr:nth-child(2)").find(".checkmark-icon").should("exist")
  })

  it("Should display 2 next to the Offences tab text when HO100310 is raised", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: offenceMatchingException,
        updatedHearingOutcome: offenceMatchingException,
        errorCount: 2,
        errorLockedByUsername: "GeneralHandler"
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list>li").eq(3).contains("Offences").contains("2")
    cy.get("ul.moj-sub-navigation__list>li").eq(0).contains("Defendant").contains("2").should("not.exist")
    cy.get("ul.moj-sub-navigation__list>li").eq(1).contains("Hearing").contains("2").should("not.exist")
    cy.get("ul.moj-sub-navigation__list>li").eq(2).contains("Case").contains("2").should("not.exist")
    cy.get("ul.moj-sub-navigation__list>li").eq(4).contains("Notes").contains("2").should("not.exist")
  })

  it("Should display checkmark next to Offences tab text when offence matching exception is resolved", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: offenceMatchingException,
        updatedHearingOutcome: offenceMatchingException,
        errorCount: 2
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    cy.get("ul.moj-sub-navigation__list>li").eq(3).contains("Offences").contains("2").should("exist")
    clickTab("Offences")

    cy.get("button").contains("Offence 1").click()
    cy.get("select.offence-matcher").select("001 - TH68006")

    cy.get("button").contains("Next offence").click()
    cy.get("button").contains("Offence 4").click()
    cy.get("select.offence-matcher").select("Added in court")

    submitAndConfirmExceptions()

    cy.get("ul.moj-sub-navigation__list>li").eq(3).contains("Offences").contains("2").should("not.exist")
    cy.get("ul.moj-sub-navigation__list>li").eq(3).find(".checkmark-icon").should("exist")
  })

  it("Should not display exceptions warning icons when exceptions resolved manually", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: nextHearingDateExceptions.hearingOutcomeXmlHO100102,
        updatedHearingOutcome: nextHearingDateExceptions.hearingOutcomeXmlHO100102,
        errorCount: 1,
        errorLockedByUsername: "GeneralHandler"
      }
    ])

    loginAndVisit("/bichard/court-cases/0")

    clickTab("Offences")
    cy.get("#offences tbody tr:nth-child(1)").find(".warning-icon").should("exist")
    cy.get("#offences tbody tr:nth-child(1)").find(".checkmark-icon").should("not.exist")

    resolveExceptionsManually()

    cy.visit("/bichard/court-cases/0")

    clickTab("Offences")
    cy.get("#offences tbody tr:nth-child(1)").find(".warning-icon").should("not.exist")
    cy.get("#offences tbody tr:nth-child(1)").find(".checkmark-icon").should("not.exist")
  })
})
