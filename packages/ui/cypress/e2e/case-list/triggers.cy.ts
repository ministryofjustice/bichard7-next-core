import { loginAndVisit } from "../../support/helpers"

// Unresolved and user has permission to see them (e.g. not Exception Handlers)
describe("When I can see triggers on cases", () => {
  const makeTriggers = (code?: number, count = 5) =>
    Array.from(Array(count ?? 5)).map((_, idx) => {
      return {
        triggerId: idx,
        triggerCode: `TRPR000${code ?? idx + 1}`,
        status: "Unresolved",
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      }
    })

  before(() => {
    loginAndVisit("GeneralHandler")
  })

  beforeEach(() => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "011111" }])
  })

  it("Should display individual triggers without a count", () => {
    cy.task("insertTriggers", { caseId: 0, triggers: makeTriggers() })
    loginAndVisit("TriggerHandler")

    cy.get(".trigger-description")
      .contains(/\(\d+\)/) // any number between parentheses
      .should("not.exist")
  })

  it("Should group duplicate triggers", () => {
    cy.task("insertTriggers", { caseId: 0, triggers: makeTriggers(1) })
    loginAndVisit("TriggerHandler")

    cy.get("table").find(".trigger-description").should("have.length", 1)
  })

  it("Should include a count for grouped triggers", () => {
    cy.task("insertTriggers", { caseId: 0, triggers: makeTriggers(2) })
    loginAndVisit("TriggerHandler")

    cy.get(".trigger-description")
      .contains(/\(\d+\)/) // any number between parentheses
      .should("exist")
  })

  it("Should display individual and grouped triggers together", () => {
    const triggers = [...makeTriggers(), ...makeTriggers(1)].map((t, i) => {
      t.triggerId = i
      return t
    })

    cy.task("insertTriggers", { caseId: 0, triggers })
    loginAndVisit("TriggerHandler")

    cy.get(".trigger-description:contains('PR01')")
      .contains(/\(\d+\)/) // any number between parentheses
      .should("exist")

    cy.get(".trigger-description:not(:contains('PR01'))")
      .contains(/\(\d+\)/)
      .should("not.exist")
  })

  it("Should display the correct count for grouped triggers", () => {
    const triggers = makeTriggers(1, 12)
    cy.task("insertTriggers", { caseId: 0, triggers })
    loginAndVisit("TriggerHandler")

    cy.get(".trigger-description:contains('PR01')")
      .contains(/\(\d+\)/) // any number between parentheses
      .should("include.text", "(12)")
  })

  it("Should display the correct locked tag", () => {
    const triggers = makeTriggers(1, 12)
    cy.task("insertTriggers", { caseId: 0, triggers })
    loginAndVisit("TriggerHandler", "/bichard/court-cases/0")

    cy.get("#leave-and-lock").click()

    cy.get(".locked-by-tag").contains("Trigger Handler User")

    loginAndVisit("GeneralHandler")

    // `resonCell` is misspelled
    cy.get(".resonCell").contains("HO100102")
    cy.get(".extraReasonCell").contains("PR01")

    cy.get(".locked-by-tag").should("have.length", 1)
    cy.get(".extraReasonRow .locked-by-tag").contains("Trigger Handler User")
  })
})
