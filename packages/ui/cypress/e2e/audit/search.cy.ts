import { loginAndVisit } from "../../support/helpers"

describe('Search', () => {

  it("Should show placeholder page", () => {
    loginAndVisit("Supervisor", "/bichard/audit/search")

    cy.findByText("Audit Search").should("exist")
  })

})