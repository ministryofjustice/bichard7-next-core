import { ReportType } from "@moj-bichard7/common/types/reports/ReportType"
import { ReportResults } from "features/ReportSelectionFilter/ReportResults"
import { ReportConfig } from "types/reports/Config"

const mockConfig = {
  id: "test-config",
  columns: []
} as unknown as ReportConfig

const mockRows = [
  { id: "1", data: "value 1" },
  { id: "2", data: "value 2" }
]

const dummyReportType = "DUMMY_TYPE" as ReportType

describe("ReportResults", () => {
  it("renders nothing when reportType is undefined", () => {
    cy.mount(<ReportResults isStreaming={false} reportType={undefined} rows={[]} config={null} />)
    cy.get(".results-area").should("not.exist")
  })

  it("renders nothing when rows is null", () => {
    cy.mount(<ReportResults isStreaming={false} reportType={dummyReportType} rows={null} config={null} />)
    cy.get(".results-area").should("not.exist")
  })

  it("renders the loading state when isStreaming is true", () => {
    cy.mount(<ReportResults isStreaming={true} reportType={dummyReportType} rows={[]} config={null} />)
    cy.get(".results-area").should("have.attr", "aria-busy", "true")
    cy.contains(/Loading.*report\.\.\./i).should("be.visible")
  })

  it("renders the no results message when rows is an empty array", () => {
    cy.mount(<ReportResults isStreaming={false} reportType={dummyReportType} rows={[]} config={mockConfig} />)
    cy.get(".results-area").should("have.attr", "aria-busy", "false")
    cy.get("output").contains("No results found for the selected criteria.").should("be.visible")
  })

  it("renders the no results message when config is null despite having rows", () => {
    cy.mount(<ReportResults isStreaming={false} reportType={dummyReportType} rows={mockRows} config={null} />)
    cy.get("output").contains("No results found for the selected criteria.").should("be.visible")
  })

  it("renders the ReportTable when rows exist and config is provided", () => {
    cy.mount(<ReportResults isStreaming={false} reportType={dummyReportType} rows={mockRows} config={mockConfig} />)
    cy.get('section[aria-label$="results loaded"]').should("be.visible")
    cy.get('section[aria-label$="results loaded"]').should("have.attr", "tabIndex", "-1")
  })
})
