import { loginAndVisit } from "../../../support/helpers"

describe("navigation", () => {
  it("should highlight case list nav item when navigating from case list", () => {
    cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "01" }])
    loginAndVisit("Supervisor", "/bichard/court-cases/0")

    cy.contains("nav a", "Case list").should("have.attr", "aria-current", "page")
    cy.contains("nav a", "Audit").should("not.have.attr", "aria-current", "page")
  })

  it("should highlight audit nav item when navigating from an audit page", () => {
    cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "01" }])
    loginAndVisit("Supervisor", "/bichard/court-cases/0?previousPath=/audit/123456")

    cy.contains("nav a", "Audit").should("have.attr", "aria-current", "page")
    cy.contains("nav a", "Case list").should("not.have.attr", "aria-current", "page")
  })
})