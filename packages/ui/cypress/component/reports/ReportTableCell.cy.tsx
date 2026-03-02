import { ReportTableCell } from "components/Reports/ReportTableCell"
import { JSX } from "react"

describe("ReportTableCell", () => {
  const mountCell = (value: string | JSX.Element) => {
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

  it("renders links", () => {
    mountCell(
      <a href={"/link"} target={"_blank"}>
        {"Test"}
      </a>
    )
    cy.get("td a")
      .should("have.text", "Test")
      .should("have.attr", "href", "/link")
      .should("have.attr", "target", "_blank")
  })
})
