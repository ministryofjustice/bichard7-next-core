import { BaseReportColumn } from "types/reports/Columns"
import { ReportTableHeader } from "components/Reports/ReportTableHeader"

describe("ReportTableHeader", () => {
  const mockColumns = [
    { id: "col-1", label: "Date" },
    { id: "col-2", label: "Status" },
    { id: "col-3", label: "Amount" }
  ] as unknown as BaseReportColumn[]

  const mountHeader = (groupName?: string) => {
    cy.mount(
      <table>
        <ReportTableHeader columns={mockColumns} groupName={groupName} />
      </table>
    )
  }

  it("renders only the column row when groupName is not provided", () => {
    mountHeader()

    cy.get("thead").within(() => {
      cy.get("tr").should("have.length", 1)
      cy.get("th, td").should("not.contain", "Test Group")
    })
  })

  it("renders both the group header row and the column row when groupName is provided", () => {
    const group = "Quarterly Results"
    mountHeader(group)

    cy.get("thead").within(() => {
      cy.get("tr").should("have.length", 2)

      cy.get("tr")
        .first()
        .find("th, td")
        .should("have.text", group)
        .and("have.attr", "colspan", String(mockColumns.length))

      // The second row should be the standard header row
      cy.get("tr").last().find("th, td").should("have.length", mockColumns.length)
    })
  })
})
