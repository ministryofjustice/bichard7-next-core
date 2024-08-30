import { loginAndVisit } from "../../../support/helpers"

describe("Reasons filters", () => {
  it("should not render the reasons component if no user group is specified", () => {
    loginAndVisit("NoGroups")

    cy.get("#filter-panel .reasons").should("not.exist")
  })

  it("should display all options for supervisors", () => {
    loginAndVisit("Supervisor")

    cy.get("#filter-panel .reasons .triggers").should("exist")
    cy.get("#filter-panel .reasons .exceptions").should("exist")
  })

  it("should display all options for general handlers", () => {
    loginAndVisit()

    cy.get("#filter-panel .reasons .triggers").should("exist")
    cy.get("#filter-panel .reasons .exceptions").should("exist")
  })

  it("should not render the reasons component for exception handlers", () => {
    loginAndVisit("ExceptionHandler")

    cy.get("#filter-panel .reasons").should("not.exist")
  })

  it("should render the correct reasons if a user has conflicting groups", () => {
    loginAndVisit("MultigroupSupervisor")

    cy.get("#filter-panel .reasons .triggers").should("exist")
    cy.get("#filter-panel .reasons .exceptions").should("exist")
  })
})
