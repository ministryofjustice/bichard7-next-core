import { ReportSelectionFilter } from "features/ReportSelectionFilter/ReportSelectionFilter"

describe("ReportSelectionFilter", () => {
  const checkboxesShouldNotExist = () => {
    cy.get("div#include-section").should("exist")
    cy.get("div#include-section").find("h2").should("not.exist")
    cy.get("div#include-section").find("label").should("not.exist")
  }

  const checkboxesMessageShouldExist = () => {
    cy.get('select[name="select-case-type"]').select("Resolved Exceptions/Triggers")
    cy.get("div#include-section").find("input").eq(0).click()
    cy.get("div#include-section").find("input").eq(1).click()

    cy.get("button#run-report").click()
    cy.get("div#include-section")
      .find("p.govuk-error-message")
      .should("contain", "At least one option must be selected")
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

  it("'At least one option must be selected' message is displayed when both checkboxes are unchecked and 'Run report' is clicked", () => {
    cy.mount(<ReportSelectionFilter />)

    checkboxesMessageShouldExist()
  })

  it("'At least one option must be selected' message is removed when 'Triggers' checkbox is checked and 'Run report' is clicked", () => {
    cy.mount(<ReportSelectionFilter />)

    checkboxesMessageShouldExist()

    cy.get("div#include-section").find("input").eq(0).click()

    cy.get("button#run-report").click()
    cy.get("div#include-section")
      .find("p.govuk-error-message")
      .should("not.exist", "At least one option must be selected")
  })

  it("'At least one option must be selected' message is removed when 'Exceptions' checkbox is checked and 'Run report' is clicked", () => {
    cy.mount(<ReportSelectionFilter />)

    checkboxesMessageShouldExist()

    cy.get("div#include-section").find("input").eq(1).click()

    cy.get("button#run-report").click()
    cy.get("div#include-section").find("p.govuk-error-message").should("not.exist")
  })

  it("'At least one option must be selected' message is removed when both checkboxes are checked and 'Run report' is clicked", () => {
    cy.mount(<ReportSelectionFilter />)

    checkboxesMessageShouldExist()

    cy.get("div#include-section").find("input").eq(0).click()
    cy.get("div#include-section").find("input").eq(1).click()

    cy.get("button#run-report").click()
    cy.get("div#include-section").find("p.govuk-error-message").should("not.exist")
  })
})
