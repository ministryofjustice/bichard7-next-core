import AuditResolvedBy from "@/types/AuditResolvedBy"
import { addDays, addMonths, endOfMonth, format, startOfMonth, startOfToday, subDays, subMonths } from "date-fns"
import { ReportSelectionFilter } from "features/ReportSelectionFilter/ReportSelectionFilter"

describe("ReportSelectionFilter", () => {
  beforeEach(() => {
    cy.intercept("GET", `**/bichard/api/reports*`).as("downloadApi")
  })

  const selectReportType = (
    type:
      "Resolved exceptions and triggers" | "Bail conditions" | "Warrants" | "Domestic violence and vulnerable victims"
  ) => {
    cy.get('select[name="select-case-type"]').select(type)
  }

  describe("DateRange", () => {
    const today = startOfToday()
    const earliest = startOfMonth(subMonths(today, 12))

    const fmt = (date: Date) => format(date, "yyyy-MM-dd")
    const selectWarrants = () => cy.get('select[name="select-case-type"]').select("Warrants")
    const clickRunReport = () => cy.get("button#run-report").click()
    const dateFromInput = () => cy.get("div#report-selection-date-from").find("input#date-from")
    const dateToInput = () => cy.get("div#report-selection-date-to").find("input#date-to")
    const typeFromDate = (date: Date) => dateFromInput().clear().type(fmt(date))
    const typeToDate = (date: Date) => dateToInput().clear().type(fmt(date))

    describe("rendering", () => {
      it("renders the correct fields for the date range section", () => {
        cy.mount(<ReportSelectionFilter />)
        selectWarrants()
        cy.get("div#date-range-section").should("exist")
        cy.get("div#date-range-section").find("h2").should("have.text", "Date range")
        cy.get("div#date-range-section").find("div#report-selection-date-from").should("exist")
        cy.get("div#date-range-section").find("div#report-selection-date-to").should("exist")
      })

      it("hides date range section when 'Clear filters' is clicked", () => {
        cy.mount(<ReportSelectionFilter />)
        cy.get("button#clear-filters").click()
        cy.get("div#date-range-section").find("div#report-selection-date-from").should("not.exist")
        cy.get("div#date-range-section").find("div#report-selection-date-to").should("not.exist")
      })
    })

    describe("date to disabled state", () => {
      it("is disabled before a date from is selected", () => {
        cy.mount(<ReportSelectionFilter />)
        selectWarrants()
        dateToInput().should("be.disabled")
      })

      it("is enabled after a date from is selected", () => {
        cy.mount(<ReportSelectionFilter />)
        selectWarrants()
        typeFromDate(subMonths(today, 1))
        dateToInput().should("not.be.disabled")
      })

      it("becomes disabled again when date from is cleared", () => {
        cy.mount(<ReportSelectionFilter />)
        selectWarrants()
        typeFromDate(subMonths(today, 1))
        dateFromInput().clear()
        dateToInput().should("be.disabled")
      })
    })

    describe("date to auto-population", () => {
      it("autopopulates to end of month when date from is the 1st", () => {
        cy.mount(<ReportSelectionFilter />)
        selectWarrants()
        const firstOfLastMonth = startOfMonth(subMonths(today, 1))
        typeFromDate(firstOfLastMonth)
        dateToInput().should("have.value", fmt(endOfMonth(firstOfLastMonth)))
      })

      it("autopopulates to today when date from is in the current month", () => {
        cy.mount(<ReportSelectionFilter />)
        selectWarrants()
        typeFromDate(startOfMonth(today))
        dateToInput().should("have.value", fmt(today))
      })

      it("resets date to when date from is changed", () => {
        cy.mount(<ReportSelectionFilter />)
        selectWarrants()
        typeFromDate(subMonths(today, 2))
        dateFromInput().clear()
        typeFromDate(today)
        dateToInput().should("have.value", fmt(today))
      })
    })

    describe("valid submission", () => {
      it("calls the API when a valid date range is entered and 'Run report' is clicked when from date is today", () => {
        cy.mount(<ReportSelectionFilter />)
        selectWarrants()
        typeFromDate(today)
        clickRunReport()
        cy.get("@downloadApi").should("exist")
      })

      it("calls the API when a valid date range is entered and 'Run report' is clicked when from date is the start of 2 months ago", () => {
        cy.mount(<ReportSelectionFilter />)
        selectWarrants()
        typeFromDate(startOfMonth(subMonths(today, 2)))
        clickRunReport()
        cy.get("@downloadApi").should("exist")
      })
    })

    describe("validation: required fields", () => {
      it("displays 'This field is required' for date from when empty", () => {
        cy.mount(<ReportSelectionFilter />)
        selectWarrants()
        clickRunReport()
        cy.get("div#report-selection-date-from")
          .find("p.govuk-error-message")
          .should("contain", "This field is required")
        cy.get("@downloadApi").should("not.exist")
      })

      it("displays 'This field is required' for date to when empty", () => {
        cy.mount(<ReportSelectionFilter />)
        selectWarrants()
        clickRunReport()
        cy.get("div#report-selection-date-to").find("p.govuk-error-message").should("contain", "This field is required")
        cy.get("@downloadApi").should("not.exist")
      })
    })

    describe("validation: future dates", () => {
      it("displays error when date from is in the future", () => {
        cy.mount(<ReportSelectionFilter />)
        selectWarrants()
        typeFromDate(addDays(today, 1))
        clickRunReport()
        cy.get("div#report-selection-date-from")
          .find("p.govuk-error-message")
          .should("contain", "Date cannot be in the future")
        cy.get("@downloadApi").should("not.exist")
      })

      it("displays error when date to is in the future", () => {
        cy.mount(<ReportSelectionFilter />)
        selectWarrants()
        typeFromDate(subMonths(today, 2))
        typeToDate(addDays(today, 1))
        clickRunReport()
        cy.get("div#report-selection-date-to")
          .find("p.govuk-error-message")
          .should("contain", "Date cannot be in the future")
        cy.get("@downloadApi").should("not.exist")
      })
    })

    describe("validation: 12-month limit", () => {
      it("displays error when date from is more than 12 months ago", () => {
        cy.mount(<ReportSelectionFilter />)
        selectWarrants()
        typeFromDate(subDays(earliest, 1))
        clickRunReport()
        cy.get("div#report-selection-date-from")
          .find("p.govuk-error-message")
          .should("contain", "Date must be within the last 12 months")
        cy.get("@downloadApi").should("not.exist")
      })

      it("displays error when date to is more than 12 months ago", () => {
        cy.mount(<ReportSelectionFilter />)
        selectWarrants()
        typeFromDate(earliest)
        typeToDate(subDays(earliest, 1))
        clickRunReport()
        cy.get("div#report-selection-date-to")
          .find("p.govuk-error-message")
          .should("contain", "Date must be within the last 12 months")
        cy.get("@downloadApi").should("not.exist")
      })
    })

    describe("validation: date order", () => {
      it("displays errors when date from is after date to", () => {
        cy.mount(<ReportSelectionFilter />)
        selectWarrants()
        typeFromDate(today)
        typeToDate(subDays(today, 5))
        clickRunReport()
        cy.get("div#report-selection-date-from")
          .find("p.govuk-error-message")
          .should("contain", "Date cannot be after 'Date to'")
        cy.get("div#report-selection-date-to")
          .find("p.govuk-error-message")
          .should("contain", "Date cannot be before 'Date from'")
        cy.get("@downloadApi").should("not.exist")
      })
    })

    describe("validation: 1-month range limit", () => {
      it("displays error when date to exceeds 1 month after date from", () => {
        cy.mount(<ReportSelectionFilter />)
        selectWarrants()
        const from = subMonths(today, 2)
        typeFromDate(from)
        typeToDate(addDays(addMonths(from, 1), 1))
        clickRunReport()
        cy.get("div#report-selection-date-to")
          .find("p.govuk-error-message")
          .should("contain", "Date to cannot be more than 1 month after date from")
        cy.get("@downloadApi").should("not.exist")
      })

      it("does not display an error when date to is exactly 1 month after date from", () => {
        cy.mount(<ReportSelectionFilter />)
        selectWarrants()
        typeFromDate(subMonths(today, 2))
        clickRunReport()
        cy.get("div#report-selection-date-to").find("p.govuk-error-message").should("not.exist")
        cy.get("@downloadApi").should("exist")
      })
    })
  })

  describe("ReportTypeDropdown", () => {
    it("renders the correct fields for report section", () => {
      cy.mount(<ReportSelectionFilter />)
      cy.get("div#report-section").should("exist")
      cy.get("div#report-section").find("h2").should("have.text", "Reports")
      cy.get("div#report-section").find("label").should("have.text", "Select report")
      cy.get('select[name="select-case-type"]').should("exist")
    })

    it("clears report selection dropdown when 'Clear filters' is clicked", () => {
      cy.mount(<ReportSelectionFilter />)
      selectReportType("Resolved exceptions and triggers")
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
      selectReportType("Resolved exceptions and triggers")
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
      selectReportType("Resolved exceptions and triggers")
      cy.get("button#clear-filters").click()
      cy.get("#checkboxes-container").should("not.exist")
    })
  })

  describe("TriggersExceptionsCheckboxes", () => {
    const apiCallCheck = (shouldRun: boolean) => {
      const currentDate = new Date().toISOString().split("T")[0]
      cy.get("div#date-range-section").find("input#date-from").type(currentDate)
      cy.get("div#date-range-section").find("input#date-to").type(currentDate)
      cy.get("button#run-report").click()
      cy.get("@downloadApi").should(shouldRun ? "exist" : "not.exist")
    }

    const checkboxesShouldNotExist = () => {
      cy.get("div#include-section").should("exist")
      cy.get("div#include-section").find("h2").should("not.exist")
      cy.get("div#include-section").find("label").should("not.exist")
    }

    const checkboxesMessageShouldExist = () => {
      selectReportType("Resolved exceptions and triggers")
      cy.get("div#include-section").find("input").eq(0).click()
      cy.get("div#include-section").find("input").eq(1).click()

      cy.get("button#run-report").click()
      cy.get("div#include-section")
        .find("p.govuk-error-message")
        .should("contain", "At least one option must be selected")
    }

    it("calls API when both checkboxes are selected and 'Run report' is clicked", () => {
      cy.mount(<ReportSelectionFilter />)
      selectReportType("Resolved exceptions and triggers")
      apiCallCheck(true)
    })

    it("calls API when 'Triggers' checkbox is selected and 'Run report' is clicked", () => {
      cy.mount(<ReportSelectionFilter />)
      selectReportType("Resolved exceptions and triggers")
      cy.get("div#include-section").find("input").eq(1).click()
      apiCallCheck(true)
    })

    it("calls API when 'Exceptions' checkbox is selected and 'Run report' is clicked", () => {
      cy.mount(<ReportSelectionFilter />)
      selectReportType("Resolved exceptions and triggers")
      cy.get("div#include-section").find("input").eq(0).click()
      apiCallCheck(true)
    })

    it("renders the correct fields for include/checkboxes section when 'Resolved exceptions and triggers' is selected", () => {
      cy.mount(<ReportSelectionFilter />)

      selectReportType("Resolved exceptions and triggers")

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

    it("hides the checkboxes when something other than 'Resolved exceptions and triggers' is selected in the reports dropdown", () => {
      cy.mount(<ReportSelectionFilter />)
      checkboxesShouldNotExist()

      selectReportType("Bail conditions")
      checkboxesShouldNotExist()

      selectReportType("Domestic violence and vulnerable victims")
      checkboxesShouldNotExist()

      selectReportType("Warrants")
      checkboxesShouldNotExist()
    })

    it("Triggers and Exceptions checkboxes disappear when 'Clear filters' is clicked", () => {
      cy.mount(<ReportSelectionFilter />)

      selectReportType("Resolved exceptions and triggers")
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

  describe("ResolvedBy", () => {
    const mockResolvers: AuditResolvedBy[] = [
      { forenames: "John", surname: "Smith", username: "john.smith", deleted: false },
      { forenames: "Jim", surname: "Bob", username: "jim.bob", deleted: false }
    ]

    it("Does not display resolved by section if canUseTriggerAndExceptionQualityAuditing is false", () => {
      cy.mount(<ReportSelectionFilter canUseTriggerAndExceptionQualityAuditing={false} />)
      selectReportType("Resolved exceptions and triggers")

      cy.get("div#resolved-by-section").should("not.exist")
    })

    it("Displays resolved by section if canUseTriggerAndExceptionQualityAuditing is true", () => {
      cy.mount(<ReportSelectionFilter canUseTriggerAndExceptionQualityAuditing={true} />)
      selectReportType("Resolved exceptions and triggers")

      cy.get("div#resolved-by-section").should("exist")
    })

    it("Displays field required error message if no users are selected and run report is clicked", () => {
      cy.mount(<ReportSelectionFilter canUseTriggerAndExceptionQualityAuditing={true} resolvedBy={mockResolvers} />)
      selectReportType("Resolved exceptions and triggers")

      cy.get("button#run-report").click()
      cy.get("div#resolved-by-section").find("p.govuk-error-message").should("exist", "This field is required")
    })

    it("Field required error message is removed after a user is selected", () => {
      cy.mount(<ReportSelectionFilter canUseTriggerAndExceptionQualityAuditing={true} resolvedBy={mockResolvers} />)
      selectReportType("Resolved exceptions and triggers")

      cy.get("button#run-report").click()
      cy.get("div#resolved-by-section").find("input").eq(0).click()
      cy.get("div#resolved-by-section").find("p.govuk-error-message").should("not.exist", "This field is required")
    })
  })
})
