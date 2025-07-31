import resultQualifiers from "../../../../test/test-data/resultQualifiers.json"
import { clickTab } from "../../../support/helpers"

describe("Check Result Qualifiers", () => {
  before(() => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: resultQualifiers.hearingOutcomeXml,
        errorCount: 0,
        errorLockedByUsername: null,
        triggerLockedByUsername: null
      }
    ])
  })

  beforeEach(() => {
    cy.loginAs("GeneralHandler")
    cy.visit("/bichard/court-cases/0")

    clickTab("Offences")

    cy.get("tbody tr:first-child a.govuk-link").click()
  })

  it("has two result qualifier code table rows", () => {
    cy.get(".hearing-result-1").contains("dt", "Result qualifier codes")
    cy.get(".hearing-result-2").contains("dt", "Result qualifier code")
  })

  it("will have three codes in the first table", () => {
    cy.get(".hearing-result-1").contains("dt", "Result qualifier codes").siblings().should("contain.text", "F (Consecutive)")
    cy.get(".hearing-result-1").contains("dt", "Result qualifier codes").siblings().should("contain.text", "YP (Effective)")
    cy.get(".hearing-result-1").contains("dt", "Result qualifier codes").siblings().should("contain.text", "RA (Condition - Other)")
  })

  it("will have one codes in the second table", () => {
    cy.get(".hearing-result-2").contains("dt", "Result qualifier code").siblings().should("contain.text", "F (Consecutive)")
  })
})
