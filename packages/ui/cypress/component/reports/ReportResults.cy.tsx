import { ReportType } from "@moj-bichard7/common/types/reports/ReportType"
import { ReportResults } from "features/ReportSelectionFilter/ReportResults"
import { FlatReportConfig, ReportData } from "types/reports/Config" // Adjust import path

const mockConfig: FlatReportConfig<Record<string, unknown>> = {
  structure: "flat",
  endpoint: "/api/dummy",
  reportType: "DUMMY_TYPE" as ReportType,
  columns: []
}

const mockRows = [
  { id: "1", data: "value 1" },
  { id: "2", data: "value 2" }
]

const mockReportData: ReportData = {
  config: mockConfig,
  rows: mockRows
}

const dummyReportType = "DUMMY_TYPE" as ReportType

describe("ReportResults", () => {
  it("renders nothing when reportType is undefined", () => {
    cy.mount(<ReportResults isStreaming={false} reportType={undefined} reportData={null} />)

    cy.get(".results-area").should("not.exist")
  })

  it("renders an empty container when reportData is null (report hasn't run)", () => {
    cy.mount(<ReportResults isStreaming={false} reportType={dummyReportType} reportData={null} />)

    cy.get(".results-area").should("exist").and("be.empty")
  })

  it("renders the loading state when isStreaming is true", () => {
    cy.mount(<ReportResults isStreaming={true} reportType={dummyReportType} reportData={null} />)

    cy.get(".results-area").should("have.attr", "aria-busy", "true")
    cy.contains(/Loading.*report\.\.\./i).should("be.visible")
  })

  it("renders the no results message when rows is an empty array", () => {
    const emptyData: ReportData = { config: mockConfig, rows: [] }

    cy.mount(<ReportResults isStreaming={false} reportType={dummyReportType} reportData={emptyData} />)

    cy.get(".results-area").should("have.attr", "aria-busy", "false")
    cy.get("output").contains("No results found for the selected criteria.").should("be.visible")
  })

  it("renders the ReportTable when valid reportData is provided", () => {
    cy.mount(<ReportResults isStreaming={false} reportType={dummyReportType} reportData={mockReportData} />)

    cy.get('section[aria-label$="results loaded"]').should("be.visible")
    cy.get('section[aria-label$="results loaded"]').should("have.attr", "tabIndex", "-1")
  })
})
