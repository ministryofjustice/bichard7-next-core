import { loginAndVisit } from "../../../../support/helpers"
import HO100320 from "../fixtures/HO100312-and-HO100320.json"

describe("Offence matching HO100320", () => {
  const fields = {
    defendantName: "Offence Matching HO100320",
    orgForPoliceFilter: "01",
    hearingOutcome: HO100320,
    errorCount: 2,
    errorReason: "HO100320",
    errorReport: "HO100320||ds:OffenceReasonSequence"
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

    cy.get("#offences tbody tr:nth-child(5)").contains("Text Text Text").click()
  })

  it("doesn't display the offence matcher for offences with a HO100320 exception", () => {
    cy.get("select.offence-matcher").should("not.exist")
  })

  it("should explain what to with a HO100320 exception", () => {
    cy.get(".error-prompt").should(
      "have.text",
      "Go back to old Bichard, fix it and resubmit. Manual sequence number identifies an offence that matches a PNC offence but doesn't match a court offence (i.e. the offence code or dates do not match correctly"
    )
  })
})
