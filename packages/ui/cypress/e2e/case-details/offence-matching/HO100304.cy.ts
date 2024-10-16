import { loginAndVisit } from "../../../support/helpers"
import HO100304 from "./fixtures/HO100304.json"

describe("Offence matching HO100304", () => {
  const fields = {
    defendantName: "Offence Matching HO100304",
    orgForPoliceFilter: "01",
    hearingOutcome: HO100304,
    errorCount: 2,
    errorReason: "HO100304",
    errorReport: "HO100304||ds:ArrestSummonsNumber"
  }

  before(() => {
    cy.loginAs("GeneralHandler")
  })

  beforeEach(() => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [fields])

    loginAndVisit()
    cy.get("a[class*='Link']").contains(fields.defendantName).click()
    cy.get("ul.moj-sub-navigation__list").contains("Offences").click()

    cy.get("#offences").contains("Theft of pedal cycle").click()
  })

  it("doesn't display the offence matcher for offences with a HO100304 exception", () => {
    cy.get("select.offence-matcher").should("not.exist")
  })

  it("should explain what to with a HO100304 exception", () => {
    cy.get(".error-prompt").should(
      "have.text",
      "If offences appear to match, then check if offence dates match also. After this manually resolve on the PNC, to deal with error, and then manually resolved in Bichard."
    )
  })
})
