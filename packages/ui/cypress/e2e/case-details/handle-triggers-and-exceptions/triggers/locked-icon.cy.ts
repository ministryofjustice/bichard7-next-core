import { caseURL, resolvedTriggers, unresolvedTriggers } from "../../../../fixtures/triggers"

describe("Locked icon", () => {
  beforeEach(() => {
    cy.task("clearTriggers")
    cy.task("clearCourtCases")
    cy.loginAs("GeneralHandler")
  })

  it("Should display the trigger lock tag if the triggers or exceptions locked", () => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        errorLockedByUsername: "BichardForce04",
        orgForPoliceFilter: "01",
        triggerLockedByUsername: "BichardForce04"
      }
    ])
    cy.task("insertTriggers", { caseId: 0, triggers: unresolvedTriggers })
    cy.visit(caseURL)
    cy.get("section#triggers").find(".triggers-locked-tag").should("exist")
    cy.get("section#exceptions").find(".exceptions-locked-tag").should("exist")
  })

  it("Should display the resolution status if the triggers or exceptions are resolved", () => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        errorStatus: "Resolved",
        orgForPoliceFilter: "01",
        triggerStatus: "Resolved"
      }
    ])
    cy.task("insertTriggers", { caseId: 0, triggers: resolvedTriggers })
    cy.visit(caseURL)
    cy.get("section#triggers").find(".triggers-resolved-tag").should("exist")
    cy.get("section#exceptions").find(".exceptions-resolved-tag").should("exist")
  })

  it("Should display the submitted status when exceptions are submitted", () => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        errorStatus: "Submitted",
        orgForPoliceFilter: "01"
      }
    ])
    cy.visit(caseURL)
    cy.get("section#exceptions").find(".exceptions-submitted-tag").should("exist")
  })

  it("Should display a lock icon when someone else has the triggers locked", () => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        triggerLockedByUsername: "BichardForce04"
      }
    ])
    cy.task("insertTriggers", { caseId: 0, triggers: unresolvedTriggers })
    cy.visit(caseURL)
    cy.get(".triggers-locked-tag img").should("exist")
  })

  it("Should display the lock holders username when someone else has the triggers locked", () => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        triggerLockedByUsername: "BichardForce04"
      }
    ])
    cy.task("insertTriggers", { caseId: 0, triggers: unresolvedTriggers })
    cy.visit(caseURL)
    cy.get("#header-container").should("contain.text", "Bichard Test User Force 04")
    cy.get("#header-container").should("not.contain.text", "GeneralHandler")
    cy.get("#triggers").should("contain.text", "Bichard Test User Force 04")
    cy.get("#triggers").should("not.contain.text", "GeneralHandler")
  })
})
