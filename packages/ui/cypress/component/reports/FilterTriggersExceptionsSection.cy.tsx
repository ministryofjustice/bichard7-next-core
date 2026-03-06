import { ReportSelectionFilter } from "features/ReportSelectionFilter/ReportSelectionFilter"

describe("ReportSelectionFilter", () => {
  beforeEach(() => {
    cy.intercept("GET", `**/bichard/api/reports*`).as("downloadApi")
  })

  const apiCallCheck = (shouldRun: boolean) => {
    const currentDate = new Date().toISOString().split("T")[0]
    cy.get("div#date-range-section").find("input#date-resolvedFrom").type(currentDate)
    cy.get("div#date-range-section").find("input#date-resolvedTo").type(currentDate)
    cy.get("button#run-report").click()
    cy.get("@downloadApi").should(shouldRun ? "exist" : "not.exist")
  }

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

  it("calls API when both checkboxes are selected and 'Run report' is clicked", () => {
    cy.mount(<ReportSelectionFilter />)
    cy.get('select[name="select-case-type"]').select("Resolved Exceptions/Triggers")
    apiCallCheck(true)
  })

  it("calls API when 'Triggers' checkbox is selected and 'Run report' is clicked", () => {
    cy.mount(<ReportSelectionFilter />)
    cy.get('select[name="select-case-type"]').select("Resolved Exceptions/Triggers")
    cy.get("div#include-section").find("input").eq(1).click()
    apiCallCheck(true)
  })

  it("calls API when 'Exceptions' checkbox is selected and 'Run report' is clicked", () => {
    cy.mount(<ReportSelectionFilter />)
    cy.get('select[name="select-case-type"]').select("Resolved Exceptions/Triggers")
    cy.get("div#include-section").find("input").eq(0).click()
    apiCallCheck(true)
  })

  it("renders the correct fields for include/checkboxes section when 'Resolved Exceptions/Triggers' is selected", () => {
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

  it("hides the checkboxes when something other than 'Resolved Exceptions/Triggers' is selected in the reports dropdown", () => {
    cy.mount(<ReportSelectionFilter />)
    checkboxesShouldNotExist()

    cy.get('select[name="select-case-type"]').select("Bail Conditions")
    checkboxesShouldNotExist()

    cy.get('select[name="select-case-type"]').select("Domestic Violence & Vulnerable Victims")
    checkboxesShouldNotExist()

    cy.get('select[name="select-case-type"]').select("Warrants")
    checkboxesShouldNotExist()
  })

  it("Triggers and Exceptions checkboxes disappear when 'Clear filters' is clicked", () => {
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
    apiCallCheck(false)
  })

  it("'At least one option must be selected' message is removed when 'Triggers' checkbox is checked and 'Run report' is clicked", () => {
    cy.mount(<ReportSelectionFilter />)

    checkboxesMessageShouldExist()
    apiCallCheck(false)

    cy.get("div#include-section").find("input").eq(0).click()

    cy.get("button#run-report").click()
    cy.get("div#include-section")
      .find("p.govuk-error-message")
      .should("not.exist", "At least one option must be selected")
  })

  it("'At least one option must be selected' message is removed when 'Exceptions' checkbox is checked and 'Run report' is clicked", () => {
    cy.mount(<ReportSelectionFilter />)

    checkboxesMessageShouldExist()
    apiCallCheck(false)

    cy.get("div#include-section").find("input").eq(1).click()

    cy.get("button#run-report").click()
    cy.get("div#include-section").find("p.govuk-error-message").should("not.exist")
  })

  it("'At least one option must be selected' message is removed when both checkboxes are checked and 'Run report' is clicked", () => {
    cy.mount(<ReportSelectionFilter />)

    checkboxesMessageShouldExist()
    apiCallCheck(false)

    cy.get("div#include-section").find("input").eq(0).click()
    cy.get("div#include-section").find("input").eq(1).click()

    cy.get("button#run-report").click()
    cy.get("div#include-section").find("p.govuk-error-message").should("not.exist")

    apiCallCheck(true)
  })
})
