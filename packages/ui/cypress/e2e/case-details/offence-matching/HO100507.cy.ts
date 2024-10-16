import { loginAndVisit } from "../../../support/helpers"
import HO100507 from "./fixtures/HO100507.json"

describe("Offence matching HO100507", () => {
  const fields = {
    defendantName: "Offence Matching HO100507",
    orgForPoliceFilter: "01",
    hearingOutcome: HO100507,
    errorCount: 2,
    errorReason: "HO100507",
    errorReport: "HO100507||ds:ArrestSummonsNumber"
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

    cy.get("#offences").contains("Theft from a shop").click()
  })

  it("doesn't display the offence matcher for offences with a HO100507 exception", () => {
    cy.get("select.offence-matcher").should("not.exist")
  })

  it("should explain what to with a HO100507 exception", () => {
    cy.get(".error-prompt").should(
      "have.text",
      "Offences have been added in court to a Penalty case. This needs to be manually resolved on the PNC to deal with error, and then manually resolved in Bichard."
    )
  })
})
