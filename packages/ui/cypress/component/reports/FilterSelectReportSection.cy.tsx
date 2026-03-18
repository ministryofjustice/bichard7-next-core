import { ReportSelectionFilter } from "features/ReportSelectionFilter/ReportSelectionFilter"

describe("ReportSelectionFilter", () => {
  beforeEach(() => {
    cy.intercept("GET", `**/bichard/api/reports*`).as("downloadApi")
  })

  const apiCallCheck = (shouldRun: boolean) => {
    const currentDate = new Date().toISOString().split("T")[0]
    cy.get("div#date-range-section").find("input#date-from").type(currentDate)
    cy.get("div#date-range-section").find("input#date-to").type(currentDate)
    cy.get("button#run-report").click()
    cy.get("@downloadApi").should(shouldRun ? "exist" : "not.exist")
  }

  it("renders the correct fields for report section", () => {
    cy.mount(<ReportSelectionFilter />)

    cy.get("div#report-section").should("exist")
    cy.get("div#report-section").find("h2").should("have.text", "Reports")
    cy.get("div#report-section").find("label").should("have.text", "Select report")
    cy.get('select[name="select-case-type"]').should("exist")
  })

  it("clears report selection dropdown when 'Clear filters' is clicked", () => {
    cy.mount(<ReportSelectionFilter />)

    cy.get('select[name="select-case-type"]').select("Resolved Exceptions/Triggers")
    cy.get("button#clear-filters").click()
    cy.get('select[name="select-case-type"]').should("have.value", null)
  })

  it("'This field is required' message is displayed when no report is selected and 'Run report' is clicked", () => {
    cy.mount(<ReportSelectionFilter />)

    cy.get("button#run-report").click()
    cy.get("div#report-section").find("p.govuk-error-message").should("contain", "This field is required")

    apiCallCheck(false)
  })

  it("'This field is required' message is removed when a report is selected and 'Run report' is clicked", () => {
    cy.mount(<ReportSelectionFilter />)

    cy.get("button#run-report").click()
    cy.get("div#report-section").find("p.govuk-error-message").should("contain", "This field is required")
    apiCallCheck(false)

    cy.get('select[name="select-case-type"]').select("Resolved Exceptions/Triggers")
    cy.get("button#run-report").click()
    cy.get("div#report-section").find("p.govuk-error-message").should("not.exist")
    apiCallCheck(true)
  })
})
