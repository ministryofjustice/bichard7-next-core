import { ReportSelectionFilter } from "features/ReportSelectionFilter/ReportSelectionFilter"

describe("ReportSelectionFilter", () => {
  const checkboxesShouldNotExist = () => {
    cy.get("div#include-section").should("exist")
    cy.get("div#include-section").find("h2").should("not.exist")
    cy.get("div#include-section").find("label").should("not.exist")
  }

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
    cy.mount(<ReportSelectionFilter />)
    checkboxesShouldNotExist()

    cy.get('select[name="select-case-type"]').select("Bail Conditions")
    checkboxesShouldNotExist()

    cy.get('select[name="select-case-type"]').select("Domestic Violence & Vulnerable Victims")
    checkboxesShouldNotExist()

    cy.get('select[name="select-case-type"]').select("Warrants")
    checkboxesShouldNotExist()
  })

  it("Triggers and Exceptions checkboxes disappear when Clear Filters is clicked", () => {
    cy.mount(<ReportSelectionFilter />)

    cy.get('select[name="select-case-type"]').select("Resolved Exceptions/Triggers")
    cy.get("div#include-section").find("input").eq(0).click()
    cy.get("div#include-section").find("input").eq(1).click()
    cy.get("button#clear-filters").click()
    checkboxesShouldNotExist()
  })
})
