import { addDays, format, startOfToday, subDays } from "date-fns"
import { ReportSelectionFilter } from "features/ReportSelectionFilter/ReportSelectionFilter"

describe("ReportSelectionFilter", () => {
  const today = startOfToday()

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
    const todayStr = format(today, "yyyy-MM-dd")
    cy.get("div#date-range-section").find("input#date-resolvedFrom").type(todayStr)
    cy.get("div#date-range-section").find("input#date-resolvedTo").type(todayStr)
    apiCallCheck(true)
  })

  it("clears Date From value when 'Clear filters' is clicked", () => {
    cy.mount(<ReportSelectionFilter />)

    cy.get("div#date-range-section").find("div#report-selection-date-from").type("2026-02-02")
    cy.get("button#clear-filters").click()
    cy.get("div#date-range-section").find("div#report-selection-date-from").should("have.value", "")
  })

  it("clears Date To value when 'Clear filters' is clicked", () => {
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

    const futureDate = format(addDays(new Date(), 1), "yyyy-MM-dd")
    cy.get("div#date-range-section").find("div#report-selection-date-from").type(futureDate)

    cy.get("button#run-report").click()
    cy.get("div#report-selection-date-from")
      .find("p.govuk-error-message")
      .should("contain", "Date cannot be in the future")

    apiCallCheck(false)
  })

  it("'Date cannot be in the future' message is displayed when 'Date to' has a future date and 'Run report' is clicked", () => {
    cy.mount(<ReportSelectionFilter />)

    const futureDate = format(addDays(today, 1), "yyyy-MM-dd")
    cy.get("div#date-range-section").find("div#report-selection-date-to").type(futureDate)

    cy.get("button#run-report").click()
    cy.get("div#report-selection-date-to")
      .find("p.govuk-error-message")
      .should("contain", "Date cannot be in the future")

    apiCallCheck(false)
  })

  it("'Date should be within the last 31 days' message is displayed when 'Date from' has date more than 31 days ago and 'Run report' is clicked", () => {
    cy.mount(<ReportSelectionFilter />)

    const pastDate = format(subDays(new Date(), 32), "yyyy-MM-dd")
    cy.get("div#date-range-section").find("div#report-selection-date-from").type(pastDate)

    cy.get("button#run-report").click()
    cy.get("div#report-selection-date-from")
      .find("p.govuk-error-message")
      .should("contain", "Date should be within the last 31 days")

    apiCallCheck(false)
  })

  it("'Date should be within the last 31 days' message is displayed when 'Date to' has date more than 31 days ago and 'Run report' is clicked", () => {
    cy.mount(<ReportSelectionFilter />)

    const pastDate = format(subDays(new Date(), 32), "yyyy-MM-dd")
    cy.get("div#date-range-section").find("div#report-selection-date-to").type(pastDate)

    cy.get("button#run-report").click()
    cy.get("div#report-selection-date-to")
      .find("p.govuk-error-message")
      .should("contain", "Date should be within the last 31 days")

    apiCallCheck(false)
  })

  it("'Error messages are displayed when 'Date from' is before 'Date to' and 'Run report' is clicked", () => {
    cy.mount(<ReportSelectionFilter />)

    const pastDateStr = format(subDays(new Date(), 5), "yyyy-MM-dd")
    const todayStr = format(today, "yyyy-MM-dd")
    cy.get("div#date-range-section").find("div#report-selection-date-from").type(todayStr)
    cy.get("div#date-range-section").find("div#report-selection-date-to").type(pastDateStr)

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
