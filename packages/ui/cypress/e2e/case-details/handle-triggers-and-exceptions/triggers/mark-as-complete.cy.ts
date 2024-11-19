import { caseURL, defaultTriggerCases, unresolvedTrigger, unresolvedTriggers } from "../../../../fixtures/triggers"

describe("Mark as complete button", () => {
  beforeEach(() => {
    cy.task("clearTriggers")
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", defaultTriggerCases)
    cy.loginAs("GeneralHandler")
  })

  it("Should be disabled if all triggers are resolved", () => {
    cy.task("insertTriggers", { caseId: 0, triggers: [unresolvedTrigger] })

    cy.visit(caseURL)
    cy.get(".moj-tab-panel-triggers").should("be.visible")

    cy.get("#mark-triggers-complete-button").should("be.visible").should("have.attr", "disabled")
  })

  it("Should be disabled if no triggers are selected", () => {
    cy.task("insertTriggers", { caseId: 0, triggers: [unresolvedTrigger] })

    cy.visit(caseURL)

    cy.get(".trigger-header input:checkbox").should("not.be.checked")
    cy.get("#mark-triggers-complete-button").should("exist").should("have.attr", "disabled")
  })

  it("Should be enabled when one or more triggers is selected", () => {
    cy.task("insertTriggers", { caseId: 0, triggers: unresolvedTriggers })

    cy.visit(caseURL)

    // Clicks all checkboxes
    cy.get(".trigger-header input:checkbox").click({ multiple: true })
    cy.get("#mark-triggers-complete-button").should("exist").should("not.have.attr", "disabled")

    // Uncheck one checkbox
    cy.get(".trigger-header input:checkbox").eq(0).click()
    cy.get("#mark-triggers-complete-button").should("exist").should("not.have.attr", "disabled")
  })

  it("Should be disabled when all the triggers are deselected", () => {
    cy.task("insertTriggers", { caseId: 0, triggers: unresolvedTriggers })

    cy.visit(caseURL)

    // Clicks all checkboxes
    cy.get(".trigger-header input:checkbox").click({ multiple: true })
    cy.get("#mark-triggers-complete-button").should("exist").should("not.have.attr", "disabled")

    // Uncheck all checkbox
    cy.get(".trigger-header input:checkbox").click({ multiple: true })
    cy.get("#mark-triggers-complete-button").should("exist").should("have.attr", "disabled")
  })

  it("Should not be present when somebody else has the trigger lock", () => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        errorLockedByUsername: null,
        orgForPoliceFilter: "01",
        triggerLockedByUsername: "BichardForce04"
      }
    ])
    cy.task("insertTriggers", { caseId: 0, triggers: unresolvedTriggers })
    cy.visit(caseURL)
    cy.get("#mark-triggers-complete-button").should("not.exist")
  })
})
