import { ActionBar } from "features/ReportSelectionFilter/ActionBar"
import React from "react"
import { MockNextRouter } from "../../support/MockNextRouter"

describe("ActionBar", () => {
  it("renders standard actions without the CSV download button when csvDownloadUrl is null", () => {
    cy.mount(
      <ActionBar
        csvDownloadUrl={null}
        hasRows={true}
        csvReportFilename="test.csv"
        handleDownload={cy.stub().as("handleDownload")}
        clearFilters={cy.stub().as("clearFilters")}
      />
    )
    cy.get('[role="toolbar"]').should("exist")
    cy.contains("Download CSV").should("not.exist")
    cy.get("#run-report").should("be.visible").and("contain.text", "Run Report")
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
      />
    )
    cy.contains("Download CSV").should("not.exist")
  })

  it("calls handleDownload when the Run Report button is clicked", () => {
    cy.mount(
      <ActionBar
        csvDownloadUrl={null}
        hasRows={false}
        csvReportFilename={null}
        handleDownload={cy.stub().as("handleDownload")}
        clearFilters={cy.stub().as("clearFilters")}
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
      />
    )
    cy.get("#clear-filters").click()
    cy.get("@clearFilters").should("have.been.calledOnce")
  })
})
