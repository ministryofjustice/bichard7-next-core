import { ReportSelectionFilter } from "features/ReportSelectionFilter/ReportSelectionFilter"

describe("ReportSelectionFilter", () => {
  beforeEach(() => {
    cy.intercept("GET", `**/bichard/api/reports*`).as("downloadApi")
  })

  it("renders the correct fields for report section", () => {
    cy.mount(<ReportSelectionFilter />)
    cy.get("div#report-section").should("exist")
    cy.get("div#report-section").find("h2").should("have.text", "Reports")
    cy.get("div#report-section").find("label").should("have.text", "Select report")
    cy.get('select[name="select-case-type"]').should("exist")
  })

  it("clears report selection dropdown when 'Clear filters' is clicked", () => {
    cy.mount(<ReportSelectionFilter />)
    cy.get('select[name="select-case-type"]').select("Resolved exceptions and triggers")
    cy.get("button#clear-filters").click()
    cy.get('select[name="select-case-type"]').should("have.value", null)
  })

  it("'Run report' button is hidden when no report is selected", () => {
    cy.mount(<ReportSelectionFilter />)
    cy.get("button#run-report").should("not.exist")
  })

  it("'Date from' and 'Date to' fields are hidden when no report is selected", () => {
    cy.mount(<ReportSelectionFilter />)
    cy.get("#report-selection-date-from").should("not.exist")
    cy.get("#report-selection-date-to").should("not.exist")
  })

  it("'Date from' and 'Date to' fields are hidden when 'Clear filters' is clicked", () => {
    cy.mount(<ReportSelectionFilter />)
    cy.get('select[name="select-case-type"]').select("Resolved exceptions and triggers")
    cy.get("button#clear-filters").click()
    cy.get("#report-selection-date-from").should("not.exist")
    cy.get("#report-selection-date-to").should("not.exist")
  })

  it("exceptions/triggers checkboxes fields are hidden when no report is selected", () => {
    cy.mount(<ReportSelectionFilter />)
    cy.get("#checkboxes-container").should("not.exist")
  })

  it("exceptions/triggers checkboxes fields are hidden when 'Clear filters' is clicked", () => {
    cy.mount(<ReportSelectionFilter />)
    cy.get('select[name="select-case-type"]').select("Resolved exceptions and triggers")
    cy.get("button#clear-filters").click()
    cy.get("#checkboxes-container").should("not.exist")
  })
})
