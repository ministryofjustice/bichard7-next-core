import { ReportTableCell } from "components/Reports/ReportTableCell"

describe("ReportTableCell", () => {
  const mountCell = (value: unknown) => {
    cy.mount(
      <table>
        <tbody>
          <tr>
            <ReportTableCell value={value} />
          </tr>
        </tbody>
      </table>
    )
  }

  it("renders standard string values", () => {
    mountCell("Test Data")
    cy.get("td").should("have.text", "Test Data")
  })

  it("renders numeric values as strings", () => {
    mountCell(42)
    cy.get("td").should("have.text", "42")
  })

  it("renders a dash when value is undefined", () => {
    mountCell(undefined)
    cy.get("td").should("have.text", "-")
  })

  it("renders a dash when value is null", () => {
    mountCell(null)
    cy.get("td").should("have.text", "-")
  })

  it("renders boolean values as strings", () => {
    mountCell(false)
    cy.get("td").should("have.text", "false")
  })
})
