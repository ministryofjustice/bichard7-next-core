import {
  caseURL,
  defaultTriggerCases,
  mixedTriggers,
  resolvedTrigger,
  resolvedTriggers,
  unresolvedTrigger,
  unresolvedTriggers
} from "../../../../fixtures/triggers"

describe("Select all", () => {
  beforeEach(() => {
    cy.task("clearTriggers")
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", defaultTriggerCases)
    cy.loginAs("GeneralHandler")
  })

  it("Should be visible if there are multiple unresolved triggers", () => {
    cy.task("insertTriggers", { caseId: 0, triggers: unresolvedTriggers })
    cy.visit(caseURL)
    cy.get("#select-all-triggers").should("be.visible")
  })

  it("Should be hidden if all triggers are resolved", () => {
    cy.task("insertTriggers", { caseId: 0, triggers: resolvedTriggers })
    cy.visit(caseURL)
    cy.get("#select-all-triggers").should("not.exist")
  })

  it("Should be visible if there is a single unresolved trigger", () => {
    cy.task("insertTriggers", { caseId: 0, triggers: [unresolvedTrigger] })
    cy.visit(caseURL)
    cy.get("#select-all-triggers").should("be.visible")
  })

  it("Should be hidden if there is a single resolved trigger", () => {
    cy.task("insertTriggers", { caseId: 0, triggers: [resolvedTrigger] })
    cy.visit(caseURL)
    cy.get("#select-all-triggers").should("not.exist")
  })

  it("Should be visible if there is a mix of resolved and unresolved triggers", () => {
    cy.task("insertTriggers", { caseId: 0, triggers: mixedTriggers })
    cy.visit(caseURL)
    cy.get("#select-all-triggers").should("be.visible")
  })

  it("Should select all triggers when pressed if there are only unresolved triggers", () => {
    cy.task("insertTriggers", { caseId: 0, triggers: unresolvedTriggers })
    cy.visit(caseURL)
    cy.get(".trigger-header input[type='checkbox']").should("not.be.checked")
    cy.get("#select-all-triggers button").click()
    cy.get(".trigger-header input[type='checkbox']").should("be.checked")
  })

  it("Should select all triggers when pressed if there is a mix of resolved and unresolved triggers", () => {
    cy.task("insertTriggers", { caseId: 0, triggers: mixedTriggers })
    cy.visit(caseURL)
    cy.get("#select-all-triggers button").click()
    cy.get(".trigger-header input[type='checkbox']").should("be.checked")
  })

  it("Should be hidden if someone else has the triggers locked", () => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        triggerLockedByUsername: "BichardForce04"
      }
    ])
    cy.task("insertTriggers", { caseId: 0, triggers: unresolvedTriggers })
    cy.visit(caseURL)
    cy.get("#select-all-triggers").should("not.exist")
  })
})
