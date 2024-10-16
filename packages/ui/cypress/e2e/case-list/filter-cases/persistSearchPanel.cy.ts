import { loginAndVisit } from "../../../support/helpers"

beforeEach(() => {
  cy.task("clearCourtCases")
})

it("Should show search panel by default after logging in", () => {
  loginAndVisit()

  cy.contains("Apply filters")
})

it("When the user refreshes the page, the search panel should stay closed", () => {
  loginAndVisit()
  cy.get("#filter-button").contains("Hide search panel").click()
  cy.get("#filter-button").contains("Show search panel")

  cy.visit("/bichard")
  cy.get("#filter-button").contains("Show search panel")
})

it("When the user applies a filter, the search panel should stay open", () => {
  cy.task("insertDummyCourtCasesWithTriggers", {
    caseTriggers: [[{ code: "TRPR0001", status: "Unresolved" }]],
    orgCode: "01",
    triggersLockedByUsername: "BichardForce01"
  })

  loginAndVisit()

  cy.contains("Exceptions").click()
  cy.get("button[id=search]").click()
  cy.get("#filter-button").contains("Hide search panel")
})

it("The filter panel state should reset to its default after one week from its initial activation", () => {
  loginAndVisit()

  cy.get("#filter-button").contains("Hide search panel").click()
  cy.get("#filter-button").contains("Show search panel")

  // Advance time by a week
  const currentDate = new Date()
  currentDate.setDate(currentDate.getDate() - 7)
  cy.window().then((win) => {
    win.localStorage.setItem("is-filter-panel-visible-GeneralHandler", currentDate.toISOString())
  })
  cy.visit("/bichard")
  cy.get("#filter-button").contains("Hide search panel")
})
