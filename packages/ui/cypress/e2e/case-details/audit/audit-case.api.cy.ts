import AsnExceptionHO100206 from "../../../../test/test-data/HO100206.json"
import { loginAndVisit } from "../../../support/helpers"

describe("Audit case", () => {
  beforeEach(() => {
    cy.task("clearCourtCases")
  })

  it("saves audit results and replaces QualityStatusForm with QualityStatusDisplay", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: AsnExceptionHO100206.hearingOutcomeXml,
        updatedHearingOutcome: AsnExceptionHO100206.hearingOutcomeXml,
        errorCount: 1,
        errorStatus: 2
      }
    ])

    loginAndVisit("Supervisor", "/bichard/court-cases/0")

    cy.contains("Set quality status").should("be.visible")
    cy.get("select[name='trigger-quality']").should("be.visible")
    cy.get("select[name='trigger-quality']").select(1)
    cy.get("select[name='exception-quality']").should("be.visible")
    cy.get("select[name='exception-quality']").select(1)
    cy.get("textarea[name='quality-status-note']").type("test note")

    cy.get("#quality-status-submit").click()

    cy.get("select[name='trigger-quality']").should("not.exist")
    cy.get("select[name='exception-quality']").should("not.exist")
    cy.get("textarea[name='quality-status-note']").should("not.exist")
    cy.get("#quality-status-submit").should("not.exist")

    cy.contains("Quality status").should("be.visible")
    cy.contains("Trigger Quality").should("exist")
    cy.contains("Exception Quality").should("exist")
  })
})
