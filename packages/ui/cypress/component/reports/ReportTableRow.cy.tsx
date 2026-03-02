import { ReportTableRow } from "components/Reports/ReportTableRow"
import React from "react"
import type { BaseReportColumn } from "types/reports/Columns"

describe("<ReportTableRow />", () => {
  const mockColumns: BaseReportColumn[] = [
    { key: "id", header: "ID" },
    { key: "status", header: "Status" },
    { key: "date", header: "Date" }
  ]

  const mockRow = {
    id: "987",
    status: "Pending"
  }

  it("renders a cell for every column provided", () => {
    cy.mount(
      <table>
        <tbody>
          <ReportTableRow row={mockRow} columns={mockColumns} />
        </tbody>
      </table>
    )

    cy.get("td").should("have.length", 3)
  })

  it("renders the correct data in the correct columns", () => {
    cy.mount(
      <table>
        <tbody>
          <ReportTableRow row={mockRow} columns={mockColumns} />
        </tbody>
      </table>
    )

    cy.get("td").eq(0).should("have.text", "987")
    cy.get("td").eq(1).should("have.text", "Pending")
  })

  it("handles missing row data gracefully", () => {
    cy.mount(
      <table>
        <tbody>
          <ReportTableRow row={mockRow} columns={mockColumns} />
        </tbody>
      </table>
    )

    cy.get("td").eq(2).should("contain.text", "-")
  })
})
