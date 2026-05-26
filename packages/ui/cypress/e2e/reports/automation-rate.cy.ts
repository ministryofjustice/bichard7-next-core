import { loginAndVisit } from "../../support/helpers"

describe("automation rate report type filter", () => {
  beforeEach(() => {
    loginAndVisit("Supervisor", "/bichard/report-selection")
  })

  it("should display only 'Download report' button when 'Automation Rate' is selected from dropdown", () => {
    cy.get("#report-select").select("Automation rate")
    cy.get("#date-from").should("not.exist")
    cy.get("#date-to").should("not.exist")
    cy.get("#exceptions").should("not.exist")
    cy.get("#triggers").should("not.exist")
    cy.get("#download-automated-report").should("exist")
    cy.get("#download-automated-report").should("exist").and("have.attr", "href", "/reports/AutomationRate.xlsx")
  })
})
