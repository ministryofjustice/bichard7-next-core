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

  it("has two result qualifier code tables", () => {
    cy.get(".result-qualifier-code-table").should("have.length", "2")
  })

  it("will have three codes in the first table", () => {
    const tablePrefix = ".hearing-result-1 .result-qualifier-code-table "

    cy.get(tablePrefix + "h4").should("have.text", "Result qualifier codes")

    cy.get(tablePrefix + "tbody tr").should("have.length", 3)

    cy.get(tablePrefix + "tbody tr:nth-child(1) td:nth-child(1)").should("have.text", "Code 1")
    cy.get(tablePrefix + "tbody tr:nth-child(1) td:nth-child(2)").should("have.text", "F (Consecutive)")

    cy.get(tablePrefix + "tbody tr:nth-child(2) td:nth-child(1)").should("have.text", "Code 2")
    cy.get(tablePrefix + "tbody tr:nth-child(2) td:nth-child(2)").should("have.text", "YP (Effective)")

    cy.get(tablePrefix + "tbody tr:nth-child(3) td:nth-child(1)").should("have.text", "Code 3")
    cy.get(tablePrefix + "tbody tr:nth-child(3) td:nth-child(2)").should("have.text", "RA (Condition - Other)")
  })

  it("will have one codes in the second table", () => {
    const tablePrefix = ".hearing-result-2 .result-qualifier-code-table "

    cy.get(tablePrefix + "h4").should("have.text", "Result qualifier code")

    cy.get(tablePrefix + "tbody tr").should("have.length", 1)

    cy.get(tablePrefix + "tbody tr:nth-child(1) td:nth-child(1)").should("have.text", "Code")
    cy.get(tablePrefix + "tbody tr:nth-child(1) td:nth-child(2)").should("have.text", "F (Consecutive)")
  })
})
