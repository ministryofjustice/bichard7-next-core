import { loginAndVisit } from "../../support/helpers"

describe('Navigate to Reports filter page', () => {

  context("When the user is a supervisor", () => {
    before(() => {
      loginAndVisit("Supervisor", "/bichard/report-selection")
    })

    it("Should show Reports filter page", () => {
      cy.findByText("Search reports").should("exist")
    })
  })

  context("When the user is not a supervisor", () => {
    before(() => {
      loginAndVisit("GeneralHandler", "/bichard/report-selection")
    })

    it("Should redirect to the case list", () => {
      cy.location('pathname').should('eq', '/bichard')
    })
  })
})