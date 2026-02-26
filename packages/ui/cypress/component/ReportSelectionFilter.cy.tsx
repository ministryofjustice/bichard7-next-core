import { ReportSelectionFilter } from "features/ReportSelectionFilter/ReportSelectionFilter"

describe("ReportSelectionFilter", () => {
  it("renders the correct fields for report section", () => {
    cy.mount(<ReportSelectionFilter />)

    cy.get("div#report-section").should("exist")
    cy.get("div#report-section").find("h2").should("have.text", "Reports")
    cy.get("div#report-section").find("label").should("have.text", "Sort by")
    cy.get('select[name="select-case-type"]').should("exist")
  })

  it("renders the correct fields for date range section", () => {
    cy.mount(<ReportSelectionFilter />)

    cy.get("div#date-range-section").should("exist")
    cy.get("div#date-range-section").find("h2").should("have.text", "Date range")
    cy.get("div#date-range-section").find("div#report-selection-date-from").should("exist")
    cy.get("div#date-range-section").find("div#report-selection-date-to").should("exist")
  })

  it("renders the correct fields for include/checkboxes section", () => {
    cy.mount(<ReportSelectionFilter />)

    cy.get("div#include-section").should("exist")
    cy.get("div#include-section").find("h2").should("have.text", "Include")
    cy.get("div#include-section").find("label").eq(0).should("have.text", "Select an option")
    cy.get("div#include-section")
      .find("input")
      .eq(0)
      .should("have.attr", "type", "checkbox")
      .should("have.id", "triggers")

    cy.get("div#include-section")
      .find("input")
      .eq(1)
      .should("have.attr", "type", "checkbox")
      .should("have.id", "exceptions")

    cy.get("div#include-section").find("label").eq(1).should("have.attr", "for", "triggers")
    cy.get("div#include-section").find("label").eq(2).should("have.attr", "for", "exceptions")
  })

  it("renders the search button and clear search link", () => {
    cy.mount(<ReportSelectionFilter />)

    cy.get("button#search").should("exist")
    cy.get("button#search").should("have.text", "Search Reports")
    cy.get("button#search").should("have.attr", "data-module", "govuk-button")

    cy.get("a").should("have.text", "Clear search")
    cy.get("a").should("have.attr", "href", "/bichard?keywords=")
  })
})
