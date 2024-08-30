import { loginAndVisit } from "../../../../support/helpers"
import HO100311 from "../fixtures/HO100311.json"

describe("Offence matching HO100311", () => {
  const fields = {
    defendantName: "Offence Matching HO100311",
    orgForPoliceFilter: "01",
    hearingOutcome: HO100311,
    errorCount: 2,
    errorReason: "HO100311",
    errorReport: "HO100311||ds:OffenceReasonSequence"
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

    cy.get("#offences").contains("Aid and abet theft").click()
  })

  it("doesn't display the offence matcher for offences with a HO100311 exception", () => {
    cy.get("select.offence-matcher").should("not.exist")
  })

  it("should explain what to with a HO100311 exception", () => {
    cy.get(".error-prompt").should("have.text", "Duplicate court Offence Sequence Number")
  })
})
