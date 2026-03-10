import { ActionBar } from "features/ReportSelectionFilter/ActionBar"
import { MockNextRouter } from "../../support/MockNextRouter"
import { ReportType } from "@moj-bichard7/common/types/reports/ReportType"

describe("ActionBar", () => {
  const mockReportOptions = {
    reportType: "bails" as ReportType,
    fromDate: "2026-03-01",
    toDate: "2026-03-10"
  }

  it("renders standard actions without the CSV download button when csvDownloadUrl is null", () => {
    cy.mount(
      <ActionBar
        csvDownloadUrl={null}
        hasRows={true}
        csvReportFilename="test.csv"
        handleDownload={cy.stub().as("handleDownload")}
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
          csvDownloadUrl="/api/downloads/report.csv"
          hasRows={true}
          csvReportFilename="my_report.csv"
          handleDownload={cy.stub().as("handleDownload")}
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
        csvDownloadUrl="/api/downloads/report.csv"
        hasRows={false}
        csvReportFilename="my_report.csv"
        handleDownload={cy.stub().as("handleDownload")}
        clearFilters={cy.stub().as("clearFilters")}
        reportOptions={mockReportOptions}
      />
    )
    cy.contains("Download CSV").should("not.exist")
  })

  it("calls handleDownload when the Run report button is clicked", () => {
    cy.mount(
      <ActionBar
        csvDownloadUrl={null}
        hasRows={false}
        csvReportFilename={null}
        handleDownload={cy.stub().as("handleDownload")}
        clearFilters={cy.stub().as("clearFilters")}
        reportOptions={mockReportOptions}
      />
    )
    cy.get("#run-report").click()
    cy.get("@handleDownload").should("have.been.calledOnce")
  })

  it("calls clearFilters when the Clear filters button is clicked", () => {
    cy.mount(
      <ActionBar
        csvDownloadUrl={null}
        hasRows={false}
        csvReportFilename={null}
        handleDownload={cy.stub().as("handleDownload")}
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
          csvDownloadUrl="/api/downloads/report.csv"
          hasRows={true}
          csvReportFilename="my_report.csv"
          handleDownload={cy.stub().as("handleDownload")}
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

  it("does not log the CSV download if reportType is missing", () => {
    const logSpy = cy.spy().as("logCsvDownloadSpy")

    cy.intercept("GET", "/bichard/api/reports/log*", logSpy)

    cy.mount(
      <MockNextRouter>
        <ActionBar
          csvDownloadUrl="/api/downloads/report.csv"
          hasRows={true}
          csvReportFilename="my_report.csv"
          handleDownload={cy.stub().as("handleDownload")}
          clearFilters={cy.stub().as("clearFilters")}
          reportOptions={{ ...mockReportOptions, reportType: undefined }}
        />
      </MockNextRouter>
    )

    cy.contains("Download CSV").click()

    cy.get("@logCsvDownloadSpy").should("not.have.been.called")
  })
})
