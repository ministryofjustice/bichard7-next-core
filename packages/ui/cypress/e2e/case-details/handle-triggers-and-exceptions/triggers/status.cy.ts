import { caseURL, defaultTriggerCases, resolvedTriggers, unresolvedTriggers } from "../../../../fixtures/triggers"

describe("Trigger status", () => {
  beforeEach(() => {
    cy.task("clearTriggers")
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", defaultTriggerCases)
    cy.loginAs("GeneralHandler")
  })

  it("Should display a message and no button when there are no triggers on the case", () => {
    cy.visit(caseURL)
    cy.get(".moj-tab-panel-triggers").should("contain.text", "There are no triggers for this case.")
    cy.get("#mark-triggers-complete-button").should("not.exist")
  })

  it("Should show a complete badge against each resolved trigger when the trigger lock is held", () => {
    cy.task("insertTriggers", { caseId: 0, triggers: resolvedTriggers })

    cy.visit(caseURL)

    cy.get(".moj-tab-panel-triggers").should("be.visible")
    cy.get(".moj-tab-panel-exceptions").should("not.be.visible")

    cy.get(".moj-trigger-row").each((trigger) => {
      cy.wrap(trigger).get(".trigger-header").contains("Complete").should("exist")
    })
  })

  it("Should show a complete badge against each resolved trigger when the trigger lock is not held", () => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        triggerLockedByUsername: "BichardForce04",
        orgForPoliceFilter: "01"
      }
    ])
    cy.task("insertTriggers", { caseId: 0, triggers: resolvedTriggers })

    cy.visit(caseURL)

    cy.get(".moj-tab-panel-triggers").should("be.visible")
    cy.get(".moj-tab-panel-exceptions").should("not.be.visible")

    cy.get(".moj-trigger-row").each((trigger) => {
      cy.wrap(trigger).get(".trigger-header").contains("Complete").should("exist")
    })
  })

  it("Should not show checkboxes if somebody else has the triggers locked", () => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        triggerLockedByUsername: "BichardForce04",
        orgForPoliceFilter: "01"
      }
    ])
    cy.task("insertTriggers", { caseId: 0, triggers: unresolvedTriggers })
    cy.visit(caseURL)
    cy.get(".trigger-header input[type='checkbox']").should("not.exist")
    cy.get(".trigger-header input[type='checkbox']").should("not.exist")
  })
})
