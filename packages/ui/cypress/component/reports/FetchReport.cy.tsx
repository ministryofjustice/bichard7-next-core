import * as downloadService from "services/reports/downloadReport"
import * as csvService from "services/reports/createReportCsv"
import { ReportType } from "types/reports/ReportType"
import { ReportConfigs } from "types/reports/Config"
import { FetchReport } from "components/Reports/FetchReport"

describe("FetchReport", () => {
  const mockType = Object.keys(ReportConfigs)[0] as ReportType
  const mockQuery = new URLSearchParams({
    fromDate: "2026-01-01",
    toDate: "2026-01-31"
  })
  const mockData = [{ id: 1, name: "Sample Item" }]
  const mockBlob = new Blob(["csv"], { type: "text/csv" })

  beforeEach(() => {
    cy.stub(downloadService, "downloadReport").as("downloadStub").resolves(mockData)
    cy.stub(csvService, "createReportCsv").as("csvStub").resolves(mockBlob)
    cy.stub(globalThis.URL, "createObjectURL").returns("blob:mock-url")
    cy.stub(globalThis.URL, "revokeObjectURL").as("revokeStub")
  })

  it("renders correctly with valid date parameters", () => {
    cy.mount(<FetchReport type={mockType} urlQuery={mockQuery} />)
    cy.contains("button", "Load Report").should("be.enabled")
  })

  it("successfully completes the loading and data display lifecycle", () => {
    cy.intercept("GET", "**/api/reports*", {
      statusCode: 200,
      body: mockData,
      delay: 100
    }).as("getReport")

    cy.mount(<FetchReport type={mockType} urlQuery={mockQuery} />)

    cy.contains("button", "Load Report").click()

    cy.contains("button", "Loading Report...").should("be.disabled")

    cy.wait("@getReport")

    cy.get("table").should("be.visible")
    cy.contains("button", "Download CSV").should("be.visible")
  })

  it("logs an error and re-enables the button if the fetch fails", () => {
    const consoleSpy = cy.spy(console, "error")
    cy.get("@downloadStub").invoke("rejects", new Error("API Timeout"))

    cy.mount(<FetchReport type={mockType} urlQuery={mockQuery} />)
    cy.contains("button", "Load Report").click()

    cy.wrap(consoleSpy).should("have.been.calledWith", "Fetch failed:")

    cy.contains("button", "Load Report").should("be.enabled")
    cy.get("table").should("not.exist")
  })

  it("performs memory cleanup when the component is removed", () => {
    cy.intercept("GET", "**/api/reports*", {
      statusCode: 200,
      body: mockData
    }).as("getReport")

    cy.mount(<FetchReport type={mockType} urlQuery={mockQuery} />)

    cy.contains("button", "Load Report").click()

    cy.wait("@getReport").then(() => {
      cy.mount(<div />)

      cy.get("@revokeStub").should("have.been.calledWith", "blob:mock-url")
    })
  })
})
