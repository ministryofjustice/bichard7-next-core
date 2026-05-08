import { ReportTableRow } from "components/Reports/ReportTableRow"
import React from "react"
import type { BaseReportColumn } from "types/reports/Columns"

describe("<ReportTableRow />", () => {
  const mockColumns: BaseReportColumn[] = [
    { key: "id", header: "ID" },
    { key: "status", header: "Status" },
    { key: "date", header: "Date" },
    { key: "defendantName", header: "Defendant Name" }
  ]

  const mockRow = {
    id: "987",
    status: "Pending",
    defendantName: "Defendant Name",
    errorId: 123
  }

  it("renders a cell for every column provided", () => {
    cy.mount(
      <table>
        <tbody>
          <ReportTableRow row={mockRow} columns={mockColumns} />
        </tbody>
      </table>
    )

    cy.get("td").should("have.length", 4)
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

  it("turns defendantName into a link", () => {
    cy.mount(
      <table>
        <tbody>
          <ReportTableRow row={mockRow} columns={mockColumns} />
        </tbody>
      </table>
    )

    cy.get("td a")
      .should("contain.text", "Defendant Name")
      .should("have.attr", "href", "/bichard/court-cases/123")
      .should("have.attr", "target", "_blank")
  })

  it("renders username when fullName is 'Unknown User' and username is present", () => {
    const row = { fullName: "Unknown User", username: "jdoe123" }
    const cols: BaseReportColumn[] = [{ key: "fullName", header: "Full Name" }]

    cy.mount(
      <table>
        <tbody>
          <ReportTableRow row={row} columns={cols} />
        </tbody>
      </table>
    )

    cy.get("td").eq(0).should("have.text", "jdoe123")
  })

  it("renders 'Unknown User' when fullName is 'Unknown User' but username is missing", () => {
    const row = { fullName: "Unknown User" }
    const cols: BaseReportColumn[] = [{ key: "fullName", header: "Full Name" }]

    cy.mount(
      <table>
        <tbody>
          <ReportTableRow row={row} columns={cols} />
        </tbody>
      </table>
    )

    cy.get("td").eq(0).should("have.text", "Unknown User")
  })

  it("renders the actual fullName when it is not 'Unknown User'", () => {
    const row = { fullName: "Jane Smith", username: "jsmith123" }
    const cols: BaseReportColumn[] = [{ key: "fullName", header: "Full Name" }]

    cy.mount(
      <table>
        <tbody>
          <ReportTableRow row={row} columns={cols} />
        </tbody>
      </table>
    )

    cy.get("td").eq(0).should("have.text", "Jane Smith")
  })
})
