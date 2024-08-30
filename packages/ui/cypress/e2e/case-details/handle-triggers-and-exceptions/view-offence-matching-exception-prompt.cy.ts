import ExceptionHO100304 from "../../../../test/test-data/HO100304.json"
import NextHearingDateExceptions from "../../../../test/test-data/NextHearingDateExceptions.json"

describe("View offence matching exception prompts", () => {
  before(() => {
    cy.task("clearCourtCases")
    cy.loginAs("GeneralHandler")
  })

  it("Should not display an error prompt when HO100304 is not raised", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: NextHearingDateExceptions.hearingOutcomeXml,
        errorCount: 1,
        errorLockedByUsername: "GeneralHandler"
      }
    ])

    cy.visit(`/bichard/court-cases/0`)

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Offence with HO100102 - INCORRECTLY FORMATTED DATE EXCEPTION").click()

    cy.get(".offences-table").contains("td", "Matched PNC offence").should("not.exist")
  })

  // TODO: re-enable this for offence matching
  it.skip("Should display an error prompt when HO100304 is raised", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: ExceptionHO100304.hearingOutcomeXml,
        errorCount: 1,
        errorLockedByUsername: "GeneralHandler"
      }
    ])

    cy.visit(`/bichard/court-cases/0`)

    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()
    cy.get(".govuk-link").contains("Theft of pedal cycle").click()

    cy.get(".offences-table")
      .contains("td", "Matched PNC offence")
      .should(
        "include.text",
        "If offences appear to match, then check if offence dates match also. After this manually result on the PNC, to deal with error."
      )
  })
})
