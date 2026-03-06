import { addDays, subDays } from "date-fns"
import { ReportSelectionFilter } from "features/ReportSelectionFilter/ReportSelectionFilter"

describe("ReportSelectionFilter", () => {
  beforeEach(() => {
    cy.intercept("GET", `**/bichard/api/reports*`).as("downloadApi")
  })

  const apiCallCheck = (shouldRun: boolean) => {
    cy.get('select[name="select-case-type"]').select("Warrants")
    cy.get("button#run-report").click()
    cy.get("@downloadApi").should(shouldRun ? "exist" : "not.exist")
  }

  it("renders the correct fields for date range section", () => {
    cy.mount(<ReportSelectionFilter />)

    cy.get("div#date-range-section").should("exist")
    cy.get("div#date-range-section").find("h2").should("have.text", "Date range")
    cy.get("div#date-range-section").find("div#report-selection-date-from").should("exist")
    cy.get("div#date-range-section").find("div#report-selection-date-to").should("exist")
  })

  it("calls API when valid date range is entered and 'Run report' is clicked", () => {
    cy.mount(<ReportSelectionFilter />)
    const currentDate = new Date().toISOString().split("T")[0]
    cy.get("div#date-range-section").find("input#date-resolvedFrom").type(currentDate)
    cy.get("div#date-range-section").find("input#date-resolvedTo").type(currentDate)
    apiCallCheck(true)
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

  it("'This field is required' message is displayed when 'Date from' has no value and 'Run report' is clicked", () => {
    cy.mount(<ReportSelectionFilter />)

    cy.get("button#run-report").click()
    cy.get("div#report-selection-date-from").find("p.govuk-error-message").should("contain", "This field is required")
    apiCallCheck(false)
  })

  it("'This field is required' message is displayed when 'Date to' has no value and 'Run report' is clicked", () => {
    cy.mount(<ReportSelectionFilter />)

    cy.get("button#run-report").click()
    cy.get("div#report-selection-date-to").find("p.govuk-error-message").should("contain", "This field is required")
    apiCallCheck(false)
  })

  it("'Date cannot be in the future' message is displayed when 'Date from' has a future date and 'Run report' is clicked", () => {
    cy.mount(<ReportSelectionFilter />)

    const futureDate = addDays(new Date(), 1).toISOString().split("T")[0]
    cy.get("div#date-range-section").find("div#report-selection-date-from").type(futureDate)

    cy.get("button#run-report").click()
    cy.get("div#report-selection-date-from")
      .find("p.govuk-error-message")
      .should("contain", "Date cannot be in the future")

    apiCallCheck(false)
  })

  it("'Date cannot be in the future' message is displayed when 'Date to' has a future date and 'Run report' is clicked", () => {
    cy.mount(<ReportSelectionFilter />)

    const futureDate = addDays(new Date(), 1).toISOString().split("T")[0]
    cy.get("div#date-range-section").find("div#report-selection-date-to").type(futureDate)

    cy.get("button#run-report").click()
    cy.get("div#report-selection-date-to")
      .find("p.govuk-error-message")
      .should("contain", "Date cannot be in the future")

    apiCallCheck(false)
  })

  it("'Date must not be further in the past than 31 days ago' message is displayed when 'Date from' has date more than 31 days ago and 'Run report' is clicked", () => {
    cy.mount(<ReportSelectionFilter />)

    const pastDate = subDays(new Date(), 32).toISOString().split("T")[0]
    cy.get("div#date-range-section").find("div#report-selection-date-from").type(pastDate)

    cy.get("button#run-report").click()
    cy.get("div#report-selection-date-from")
      .find("p.govuk-error-message")
      .should("contain", "Date must not be further in the past than 31 days ago")

    apiCallCheck(false)
  })

  it("'Date must not be further in the past than 31 days ago' message is displayed when 'Date to' has date more than 31 days ago and 'Run report' is clicked", () => {
    cy.mount(<ReportSelectionFilter />)

    const pastDate = subDays(new Date(), 32).toISOString().split("T")[0]
    cy.get("div#date-range-section").find("div#report-selection-date-to").type(pastDate)

    cy.get("button#run-report").click()
    cy.get("div#report-selection-date-to")
      .find("p.govuk-error-message")
      .should("contain", "Date must not be further in the past than 31 days ago")

    apiCallCheck(false)
  })

  it("'Error messages are displayed when 'Date from' is before 'Date to' and 'Run report' is clicked", () => {
    cy.mount(<ReportSelectionFilter />)

    const pastDate = subDays(new Date(), 5).toISOString().split("T")[0]
    const currentDate = new Date().toISOString().split("T")[0]
    cy.get("div#date-range-section").find("div#report-selection-date-from").type(currentDate)
    cy.get("div#date-range-section").find("div#report-selection-date-to").type(pastDate)

    cy.get("button#run-report").click()
    cy.get("div#report-selection-date-from")
      .find("p.govuk-error-message")
      .should("contain", "Date cannot be after 'Date to'")
    cy.get("div#report-selection-date-to")
      .find("p.govuk-error-message")
      .should("contain", "Date cannot be before 'Date from'")

    apiCallCheck(false)
  })
})
