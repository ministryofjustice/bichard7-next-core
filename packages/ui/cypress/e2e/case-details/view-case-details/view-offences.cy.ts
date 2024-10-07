import dummyMultipleHearingResultsAho from "../../../../test/test-data/multipleHearingResultsOnOffence.json"
import { clickTab, loginAndVisit } from "../../../support/helpers"
import nextHearingDateExceptions from "../../../../test/test-data/NextHearingDateExceptions.json"
import a11yConfig from "../../../support/a11yConfig"
import logAccessibilityViolations from "../../../support/logAccessibilityViolations"

describe("when scanning page for accessibility", () => {
  it("Should display an offence with multiple results with no accessibility violations", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: nextHearingDateExceptions.hearingOutcomeXml,
        updatedHearingOutcome: nextHearingDateExceptions.updatedHearingOutcomeXml,
        errorCount: 1
      }
    ])
    loginAndVisit("/bichard/court-cases/0")
    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Offence with HO100102 - INCORRECTLY FORMATTED DATE EXCEPTION").click()

    cy.injectAxe()
    cy.checkA11y(undefined, a11yConfig, logAccessibilityViolations)
  })

  it.skip("Should display the list of offences with no accessibility violations", () => {
    //   0    │ 'empty-table-header' │ 'minor' │ 'Ensures table headers have discernible text' │   1
    // TODO: confirm and update missing table header / or disable the rule if we don't care about this
    cy.task("insertMultipleDummyCourtCases", { numToInsert: 1, force: "01" })
    loginAndVisit("/bichard/court-cases/0")
    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.injectAxe()
    cy.checkA11y(undefined, a11yConfig, logAccessibilityViolations)
  })
})

describe("“next offence” and “previous offence” buttons", () => {
  beforeEach(() => {
    cy.task("clearCourtCases")
    cy.task("clearTriggers")
    cy.task("clearCourtCases")
    cy.loginAs("GeneralHandler")
  })

  it("Should show next offence when next button is clicked if its not the last offence", () => {
    cy.task("insertMultipleDummyCourtCases", { numToInsert: 1, force: "01" })
    cy.visit("/bichard/court-cases/0")
    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get("tbody tr:first-child a.govuk-link").click()
    cy.get('button:contains("Next offence")').should("have.length", 2)
    cy.get("button").contains("Next offence").click()
    cy.get('button:contains("Next offence")').should("have.length", 2)
    cy.get("h3").should("include.text", "Offence 2 of 3")
    cy.get("button").contains("Next offence").click()
    cy.get("h3").should("include.text", "Offence 3 of 3")
    cy.get("button").should("not.contain.text", "Next offence")
  })

  it("Should show previous offence when previous button is clicked if its not the first offence", () => {
    cy.task("insertMultipleDummyCourtCases", { numToInsert: 1, force: "01" })
    cy.visit("/bichard/court-cases/0")
    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get("tbody tr:first-child a.govuk-link").click()
    cy.get("button").should("not.contain.text", "Previous offence")
    cy.get("button").contains("Next offence").click()
    cy.get("button").contains("Next offence").click()
    cy.get('button:contains("Previous offence")').should("have.length", 2)
    cy.get("button").contains("Previous offence").click()
    cy.get("h3").should("include.text", "Offence 2 of 3")
    cy.get('button:contains("Previous offence")').should("have.length", 2)
    cy.get("button").contains("Previous offence").click()
    cy.get("h3").should("include.text", "Offence 1 of 3")
    cy.get("button").should("not.contain.text", "Previous offence")
  })

  it("Should not show any buttons when there is only one offence", () => {
    cy.task("insertCourtCaseWithMultipleOffences", { case: { orgForPoliceFilter: "01" }, offenceCount: 1 })
    cy.visit("/bichard/court-cases/0")
    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get("tbody tr:first-child a.govuk-link").click()
    cy.get("button").should("not.contain.text", "Previous offence")
    cy.get("button").should("not.contain.text", "Next offence")
  })
})

it("Should show line breaks in hearing result text", () => {
  cy.task("insertCourtCasesWithFields", [
    {
      orgForPoliceFilter: "01",
      hearingOutcome: dummyMultipleHearingResultsAho.hearingOutcomeXml,
      errorCount: 1
    }
  ])

  loginAndVisit("/bichard/court-cases/0")
  clickTab("Offences")

  cy.get("tbody tr:first-child a.govuk-link").click()
  cy.get(".result-text .row-value")
    .eq(3)
    .should(
      "have.text",
      "Disqualified for holding or obtaining a driving licence for 12 month(s).\n\nDisqualification obligatory for the offence.\n\n Driving record endorsed.\n\n Section 34(1) Road Traffic Offenders Act 1988."
    )
})
