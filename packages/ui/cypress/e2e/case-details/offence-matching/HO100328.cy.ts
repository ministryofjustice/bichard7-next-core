import { loginAndVisit } from "../../../support/helpers"
import HO100328 from "./fixtures/HO100328.json"

describe("Offence matching HO100328", () => {
  const fields = {
    defendantName: "Offence Matching HO100328",
    orgForPoliceFilter: "01",
    hearingOutcome: HO100328,
    errorCount: 2,
    errorReason: "HO100328",
    errorReport: "HO100328||ds:ArrestSummonsNumber"
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

    cy.get("#offences").contains("Text Text Text").click()
  })

  it("doesn't display the offence matcher for offences with a HO100328 exception", () => {
    cy.get("select.offence-matcher").should("not.exist")
  })

  it("should explain what to with a HO100328 exception", () => {
    cy.get(".error-prompt").should(
      "have.text",
      "Court offences match both a CCR and a PCR. This needs to be manually resolved on the PNC to deal with error, and then manually resolved in Bichard."
    )
  })
})
