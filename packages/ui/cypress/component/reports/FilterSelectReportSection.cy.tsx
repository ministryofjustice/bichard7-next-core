import { ReportSelectionFilter } from "features/ReportSelectionFilter/ReportSelectionFilter"

describe("ReportSelectionFilter", () => {
  it("renders the correct fields for report section", () => {
    cy.mount(<ReportSelectionFilter />)

    cy.get("div#report-section").should("exist")
    cy.get("div#report-section").find("h2").should("have.text", "Reports")
    cy.get("div#report-section").find("label").should("have.text", "Select report")
    cy.get('select[name="select-case-type"]').should("exist")
  })

  it("clears report selection dropdown when Clear Filters is clicked", () => {
    cy.mount(<ReportSelectionFilter />)

    cy.get('select[name="select-case-type"]').select("Resolved Exceptions/Triggers")
    cy.get("button#clear-filters").click()
    cy.get('select[name="select-case-type"]').should("have.value", null)
  })

  it("'This field is required' message is displayed when no report is selected and 'Run report' is clicked", () => {
    cy.mount(<ReportSelectionFilter />)

    cy.get("button#run-report").click()
    cy.get("div#report-section").find("p.govuk-error-message").should("contain", "This field is required")
  })

  it("'This field is required' message is removed when a report is selected and 'Run report' is clicked", () => {
    cy.mount(<ReportSelectionFilter />)

    cy.get("button#run-report").click()
    cy.get("div#report-section").find("p.govuk-error-message").should("contain", "This field is required")

    cy.get('select[name="select-case-type"]').select("Resolved Exceptions/Triggers")
    cy.get("button#run-report").click()
    cy.get("div#report-section").find("p.govuk-error-message").should("not.exist")
  })
})
