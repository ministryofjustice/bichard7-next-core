import { loginAndVisit } from "../../support/helpers"

describe('Search', () => {

  context("When the user is a supervisor", () => {
    before(() => {
      cy.log("about to clearUsers")
      cy.task("clearUsers")
      cy.log("about to insertUsers")
      cy.task("insertUsers", { users: [
          { username: "username01", forenames: "username", surname: "01", email: "username01@example.com", visibleForces: ["01","001"] },
          { username: "username02", forenames: "username", surname: "02", email: "username02@example.com", visibleForces: ["01","001"] },
          { username: "username03", forenames: "username", surname: "03", email: "username03@example.com", visibleForces: ["01","001"] }
        ]})
      cy.log("logging in and visiting!")
      loginAndVisit("Supervisor", "/bichard/audit/search")
    })

    it("Should show search page", () => {
      cy.findByText("Audit case search").should("exist")
      cy.findByText("Resolved by").should("exist")
      cy.findByText("Supervisor User").should("exist")
      cy.findByText("username 01").should("exist")
      cy.findByText("username 02").should("exist")
      cy.findByText("username 03").should("exist")
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