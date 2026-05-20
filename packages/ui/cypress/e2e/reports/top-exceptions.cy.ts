import { loginAndVisit } from "../../support/helpers"

describe("top exceptions report type filter", () => {
  beforeEach(() => {
    loginAndVisit("Supervisor", "/bichard/report-selection")
  })

  it("should display only 'Download report' button when 'Top Exceptions' is selected from dropdown", () => {
    cy.get("#report-select").select("Top Exceptions")
    cy.get("#date-from").should("not.exist")
    cy.get("#date-to").should("not.exist")
    cy.get("#exceptions").should("not.exist")
    cy.get("#triggers").should("not.exist")
    cy.get("#download-automated-report").should("exist")
    cy.get("#download-automated-report").should("exist").and("have.attr", "href", "/reports/TopExceptions.xlsx")
  })
})
