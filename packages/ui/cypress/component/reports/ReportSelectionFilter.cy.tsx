import { ReportSelectionFilter } from "features/ReportSelectionFilter/ReportSelectionFilter"

describe("ReportSelectionFilter", () => {
  it("renders the correct fields for report section", () => {
    cy.mount(<ReportSelectionFilter />)

    cy.get("div#report-section").should("exist")
    cy.get("div#report-section").find("h2").should("have.text", "Reports")
    cy.get("div#report-section").find("label").should("have.text", "Select Report")
    cy.get('select[name="select-case-type"]').should("exist")
  })

  it("renders the correct fields for date range section", () => {
    cy.mount(<ReportSelectionFilter />)

    cy.get("div#date-range-section").should("exist")
    cy.get("div#date-range-section").find("h2").should("have.text", "Date range")
    cy.get("div#date-range-section").find("div#report-selection-date-from").should("exist")
    cy.get("div#date-range-section").find("div#report-selection-date-to").should("exist")
  })

  it("renders the correct fields for include/checkboxes section when triggers/exceptions is selected", () => {
    cy.mount(<ReportSelectionFilter />)

    cy.get('select[name="select-case-type"]').select("Resolved Exceptions/Triggers")

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

  it("hides the checkboxes when something other than trigger/exceptions is selected in the reports dropdown", () => {
    const checkboxesShouldNotExist = () => {
      cy.get("div#include-section").should("exist")
      cy.get("div#include-section").find("h2").should("not.exist")
      cy.get("div#include-section").find("label").should("not.exist")
    }

    cy.mount(<ReportSelectionFilter />)
    checkboxesShouldNotExist()

    cy.get('select[name="select-case-type"]').select("Bail Conditions")
    checkboxesShouldNotExist()

    cy.get('select[name="select-case-type"]').select("Domestic Violence & Vulnerable Victims")
    checkboxesShouldNotExist()

    cy.get('select[name="select-case-type"]').select("Warrants")
    checkboxesShouldNotExist()
  })

  it("renders the run reports button and clear filters link", () => {
    cy.mount(<ReportSelectionFilter />)

    cy.get("button#run-report").should("exist")
    cy.get("button#run-report").should("have.text", "Run Report")
    cy.get("button#run-report").should("have.attr", "data-module", "govuk-button")

    cy.get("button#clear-filters").should("have.text", "Clear filters")
  })
})
