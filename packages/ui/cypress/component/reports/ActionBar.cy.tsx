import { xlsxFilename } from "@/services/reports/utils/xlsxFilename"
import { AutomatedReportType } from "@moj-bichard7/common/types/reports/AutomatedReportType"
import { ReportType } from "@moj-bichard7/common/types/reports/ReportType"
import { ActionBar } from "features/ReportSelectionFilter/ActionBar"
import { MockNextRouter } from "../../support/MockNextRouter"

describe("ActionBar", () => {
  const mockReportOptions = {
    reportType: "bails" as ReportType,
    fromDate: "2026-03-01",
    toDate: "2026-03-10"
  }

  const mockAutomatedReportOptions = {
    automatedReportType: "automation rate" as AutomatedReportType,
    fromDate: "",
    toDate: ""
  }

  it("renders standard actions without the CSV download button when csvDownloadUrl is null", () => {
    cy.mount(
      <ActionBar
        fileDownloadUrl={null}
        reportFilename={"test.csv"}
        hasRows={true}
        handleRunReport={cy.stub().as("handleRunReport")}
        clearFilters={cy.stub().as("clearFilters")}
        reportOptions={mockReportOptions}
      />
    )
    cy.get('[role="group"]').should("exist")
    cy.contains("Download CSV").should("not.exist")
    cy.get("#run-report").should("be.visible").and("contain.text", "Run report")
    cy.get("#clear-filters").should("be.visible").and("contain.text", "Clear filters")
  })

  it("renders the CSV download button when csvDownloadUrl is provided and hasRows is true", () => {
    cy.mount(
      <MockNextRouter>
        <ActionBar
          fileDownloadUrl={"/api/downloads/report.csv"}
          reportFilename={"my_report.csv"}
          hasRows={true}
          handleRunReport={cy.stub().as("handleRunReport")}
          clearFilters={cy.stub().as("clearFilters")}
          reportOptions={mockReportOptions}
        />
      </MockNextRouter>
    )
    cy.contains("Download CSV")
      .should("be.visible")
      .and("have.attr", "href", "/api/downloads/report.csv")
      .and("have.attr", "download", "my_report.csv")
  })

  it("does not render the CSV download button when hasRows is false despite having a valid url", () => {
    cy.mount(
      <ActionBar
        fileDownloadUrl="/api/downloads/report.csv"
        reportFilename="my_report.csv"
        hasRows={false}
        handleRunReport={cy.stub().as("handleRunReport")}
        clearFilters={cy.stub().as("clearFilters")}
        reportOptions={mockReportOptions}
      />
    )
    cy.contains("Download CSV").should("not.exist")
  })

  it("calls handleRunReport when the Run report button is clicked", () => {
    cy.mount(
      <ActionBar
        fileDownloadUrl={null}
        reportFilename={null}
        hasRows={false}
        handleRunReport={cy.stub().as("handleRunReport")}
        clearFilters={cy.stub().as("clearFilters")}
        reportOptions={mockReportOptions}
      />
    )
    cy.get("#run-report").click()
    cy.get("@handleRunReport").should("have.been.calledOnce")
  })

  it("calls clearFilters when the Clear filters button is clicked", () => {
    cy.mount(
      <ActionBar
        fileDownloadUrl={null}
        reportFilename={null}
        hasRows={false}
        handleRunReport={cy.stub().as("handleRunReport")}
        clearFilters={cy.stub().as("clearFilters")}
        reportOptions={mockReportOptions}
      />
    )
    cy.get("#clear-filters").click()
    cy.get("@clearFilters").should("have.been.calledOnce")
  })

  it("logs the CSV download via fetch when download is clicked and reportType is present", () => {
    cy.intercept("GET", "/bichard/api/reports/log*").as("logCsvDownload")

    cy.mount(
      <MockNextRouter>
        <ActionBar
          fileDownloadUrl="/api/downloads/report.csv"
          reportFilename="my_report.csv"
          hasRows={true}
          handleRunReport={cy.stub().as("handleRunReport")}
          clearFilters={cy.stub().as("clearFilters")}
          reportOptions={mockReportOptions}
        />
      </MockNextRouter>
    )

    cy.contains("Download CSV").click()

    cy.wait("@logCsvDownload").then((interception) => {
      const url = new URL(interception.request.url)
      expect(url.searchParams.get("csvDownload")).to.equal("true")
      expect(url.searchParams.get("reportType")).to.equal(mockReportOptions.reportType)
      expect(url.searchParams.get("fromDate")).to.equal(mockReportOptions.fromDate)
      expect(url.searchParams.get("toDate")).to.equal(mockReportOptions.toDate)
    })
  })

  it("does not show the CSV download button if reportType is missing", () => {
    cy.mount(
      <MockNextRouter>
        <ActionBar
          fileDownloadUrl="/api/downloads/report.csv"
          reportFilename="my_report.csv"
          hasRows={true}
          handleRunReport={cy.stub().as("handleRunReport")}
          clearFilters={cy.stub().as("clearFilters")}
          reportOptions={{ ...mockReportOptions, reportType: undefined }}
        />
      </MockNextRouter>
    )

    cy.get("body").should("not.contain", "Download CSV")
  })

  it("shows report download button if automatedReportType is present", () => {
    const reportFilename = xlsxFilename(mockAutomatedReportOptions.automatedReportType)

    cy.mount(
      <MockNextRouter>
        <ActionBar
          fileDownloadUrl={null}
          reportFilename={null}
          hasRows={false}
          handleRunReport={cy.stub().as("handleRunReport")}
          clearFilters={cy.stub().as("clearFilters")}
          reportOptions={{ ...mockAutomatedReportOptions }}
        />
      </MockNextRouter>
    )

    cy.get("#download-automated-report").should("exist").and("have.attr", "href", `/reports/${reportFilename}`)
  })

  it("logs the XLSX download via fetch when download is clicked and automatedReportType is present", () => {
    cy.intercept("GET", "/bichard/api/reports/log*").as("logCsvDownload")

    cy.mount(
      <MockNextRouter>
        <ActionBar
          fileDownloadUrl="/api/downloads/report.csv"
          reportFilename={"automated_report.xlsx"}
          hasRows={false}
          handleRunReport={cy.stub().as("handleRunReport")}
          clearFilters={cy.stub().as("clearFilters")}
          reportOptions={mockReportOptions}
        />
      </MockNextRouter>
    )

    cy.contains("Download XLSX").click()

    cy.wait("@logCsvDownload").then((interception) => {
      const url = new URL(interception.request.url)
      expect(url.searchParams.get("xlsxDownload")).to.equal("true")
      expect(url.searchParams.get("reportType")).to.equal(mockAutomatedReportOptions.automatedReportType)
    })
  })
})
