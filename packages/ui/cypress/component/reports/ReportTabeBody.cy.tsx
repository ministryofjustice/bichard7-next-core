import React from "react"
import type { BaseReportColumn } from "types/reports/Columns"
import { ReportTableBody } from "components/Reports/ReportTableBody"

describe("<ReportTableBody />", () => {
  const mockColumns: BaseReportColumn[] = [
    { key: "id", header: "ID" },
    { key: "status", header: "Status" }
  ]

  const mockRows = [
    { id: "123", status: "Active" },
    { id: "456", status: "Pending" },
    { id: "789", status: "Closed" }
  ]

  it("renders the correct number of rows", () => {
    cy.mount(
      <table>
        <ReportTableBody rows={mockRows} columns={mockColumns} />
      </table>
    )

    cy.contains("123").should("be.visible")
    cy.contains("Active").should("be.visible")
    cy.contains("456").should("be.visible")
    cy.contains("Closed").should("be.visible")
  })

  it("renders gracefully when the rows array is empty", () => {
    cy.mount(
      <table>
        <ReportTableBody rows={[]} columns={mockColumns} />
      </table>
    )

    cy.contains("123").should("not.exist")
    cy.contains("Active").should("not.exist")
  })
})
