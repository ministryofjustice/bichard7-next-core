import { loginAndVisit } from "../../support/helpers"

describe('Search', () => {

  context("When the user is a supervisor", () => {
    before(() => {
      loginAndVisit("Supervisor", "/bichard/audit/search")
    })

    it("Should show search page", () => {
      cy.findByText("Audit case search").should("exist")
    })
  })

  context("When the user is not a supervisor", () => {
    before(() => {
      loginAndVisit("GeneralHandler", "/bichard/audit/search")
    })

    it("Should redirect to the case list", () => {
      cy.location('pathname').should('eq', '/bichard')
    })
  })
})