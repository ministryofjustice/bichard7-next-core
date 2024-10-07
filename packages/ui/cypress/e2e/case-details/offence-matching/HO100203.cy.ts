import { loginAndVisit } from "../../../support/helpers"
import HO100203 from "./fixtures/HO100203.json"

describe("Offence matching HO100203", () => {
  const fields = {
    defendantName: "Offence Matching HO100203",
    orgForPoliceFilter: "01",
    hearingOutcome: HO100203,
    errorCount: 2,
    errorReason: "HO100203",
    errorReport: "HO100203||ds:CourtCaseReferenceNumber"
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

  it("doesn't display the offence matcher for offences with a HO100203 exception", () => {
    cy.get("select.offence-matcher").should("not.exist")
  })

  it("should explain what to with a HO100203 exception", () => {
    cy.get("#exceptions .exception-details").should(
      "have.text",
      "HO100203 - Go back to old Bichard, fix it and resubmit. Bad Court Case Reference Number format"
    )
  })
})
