import { loginAndVisit } from "../../../../support/helpers"
import HO100312 from "../fixtures/HO100312-and-HO100320.json"

describe("Offence matching HO100312", () => {
  const fields = {
    defendantName: "Offence Matching HO100312",
    orgForPoliceFilter: "01",
    hearingOutcome: HO100312,
    errorCount: 2,
    errorReason: "HO100312",
    errorReport: "HO100312||ds:OffenceReasonSequence"
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

  it("doesn't display the offence matcher for offences with a HO100312 exception", () => {
    cy.get("select.offence-matcher").should("not.exist")
  })

  it("should explain what to with a HO100312 exception", () => {
    cy.get(".error-prompt").should(
      "have.text",
      "Go back to old Bichard, fix it and resubmit. Manual sequence number does not match the sequence number of any PNC offence"
    )
  })
})
