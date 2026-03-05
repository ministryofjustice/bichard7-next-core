import { ReportSelectionFilter } from "features/ReportSelectionFilter/ReportSelectionFilter"

describe("ReportSelectionFilter", () => {
  it("renders the correct fields for date range section", () => {
    cy.mount(<ReportSelectionFilter />)

    cy.get("div#date-range-section").should("exist")
    cy.get("div#date-range-section").find("h2").should("have.text", "Date range")
    cy.get("div#date-range-section").find("div#report-selection-date-from").should("exist")
    cy.get("div#date-range-section").find("div#report-selection-date-to").should("exist")
  })

  it("clears Date From value when Clear Filters is clicked", () => {
    cy.mount(<ReportSelectionFilter />)

    cy.get("div#date-range-section").find("div#report-selection-date-from").type("2026-02-02")
    cy.get("button#clear-filters").click()
    cy.get("div#date-range-section").find("div#report-selection-date-from").should("have.value", "")
  })

  it("clears Date To value when Clear Filters is clicked", () => {
    cy.mount(<ReportSelectionFilter />)

    cy.get("div#date-range-section").find("div#report-selection-date-to").type("2026-02-02")
    cy.get("button#clear-filters").click()
    cy.get("div#date-range-section").find("div#report-selection-date-to").should("have.value", "")
  })
})
