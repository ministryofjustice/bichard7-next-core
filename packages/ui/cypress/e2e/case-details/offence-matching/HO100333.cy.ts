import { loginAndVisit } from "../../../support/helpers"
import HO100333 from "./fixtures/HO100333.json"

describe("Offence matching HO100333", () => {
  const fields = {
    defendantName: "Offence Matching HO100333",
    orgForPoliceFilter: "01",
    hearingOutcome: HO100333,
    errorCount: 2,
    errorReason: "HO100333",
    errorReport: "HO100333||ds:OffenceReasonSequence"
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

  it("doesn't display the offence matcher for offences with a HO100333 exception", () => {
    cy.get("select.offence-matcher").should("not.exist")
  })

  it("should explain what to with a HO100333 exception", () => {
    cy.get(".error-prompt").should(
      "have.text",
      "Go back to old Bichard, fix it and resubmit. Manual match detected but no case matches upon resubmission, suggesting ASN updated or PNC data updated manually before resubmission."
    )
  })
})
