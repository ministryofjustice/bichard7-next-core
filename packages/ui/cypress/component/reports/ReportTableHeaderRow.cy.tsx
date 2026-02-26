import { BaseReportColumn } from "types/reports/Columns"
import { ReportTableHeaderRow } from "components/Reports/ReportTableHeaderRow"

describe("ReportTableHeaderRow", () => {
  const mockColumns = [
    { key: "id", header: "ID" },
    { key: "name", header: "User Name" },
    { key: "status", header: "Status" }
  ] as BaseReportColumn[]

  const mountRow = (columns: BaseReportColumn[]) => {
    cy.mount(
      <table>
        <thead>
          <ReportTableHeaderRow columns={columns} />
        </thead>
      </table>
    )
  }

  it("renders the correct number of cells based on columns prop", () => {
    mountRow(mockColumns)
    cy.get("th, td").should("have.length", mockColumns.length)
  })

  it("renders the correct header text for each column", () => {
    mountRow(mockColumns)

    cy.get("th, td").eq(0).should("have.text", "ID")
    cy.get("th, td").eq(1).should("have.text", "User Name")
    cy.get("th, td").eq(2).should("have.text", "Status")
  })

  it("renders an empty row when columns array is empty", () => {
    mountRow([])
    cy.get("tr").should("exist")
    cy.get("th, td").should("not.exist")
  })

  it("handles different data types for header labels", () => {
    const mixedColumns = [
      { key: "col-1", header: "String Header" },
      { key: 2, header: 12345 }
    ] as unknown as BaseReportColumn[]

    mountRow(mixedColumns)
    cy.get("th, td").eq(0).should("have.text", "String Header")
    cy.get("th, td").eq(1).should("have.text", "12345")
  })
})
