import { ReportTableRow } from "components/Reports/ReportTableRow"
import type { BaseReportColumn } from "types/reports/Columns"

describe("<ReportTableRow />", () => {
  const mockColumns: BaseReportColumn[] = [
    { key: "id", header: "ID" },
    { key: "status", header: "Status" },
    { key: "date", header: "Date" },
    { key: "defendantName", header: "Defendant Name" },
    { key: "notes", header: "Notes" }
  ]

  const mockRow = {
    id: "987",
    status: "Pending",
    defendantName: "Defendant Name",
    errorId: 123,
    notes:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  }

  it("renders abbreviated text and 'show more' button for long text, and for long text only", () => {
    cy.mount(
      <table>
        <tbody>
          <ReportTableRow row={mockRow} columns={mockColumns} />
        </tbody>
      </table>
    )

    for (let i = 0; i < 4; i++) {
      cy.get("td")
        .eq(i)
        .within(() => {
          cy.get('[data-testid="expandable-cell"]').should("not.exist")
        })
    }

    cy.get("td")
      .eq(4)
      .within(() => {
        cy.get('[data-testid="expandable-cell"]').as("expandableCell")
        cy.get("@expandableCell").should("exist").find("button").should("exist").and("have.text", "show more")

        cy.get('[data-testid="expandable-cell-text"]')
          .should("exist")
          .should("have.text", "Lorem ipsum dolor sit amet, co...")
      })
  })

  it("renders full text when 'show more' button is clicked", () => {
    cy.mount(
      <table>
        <tbody>
          <ReportTableRow row={mockRow} columns={mockColumns} />
        </tbody>
      </table>
    )

    cy.get("td")
      .eq(4)
      .within(() => {
        cy.get('[data-testid="expandable-cell"]').as("expandableCell")
        cy.get("@expandableCell").should("exist").find("button").click()

        cy.get("@expandableCell")
          .should("exist")
          .should(
            "have.text",
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.show less"
          )

        cy.get("@expandableCell").should("contain", "show less")
      })
  })

  it("renders abbreviated text when 'show less' button is clicked", () => {
    cy.mount(
      <table>
        <tbody>
          <ReportTableRow row={mockRow} columns={mockColumns} />
        </tbody>
      </table>
    )

    cy.get("td")
      .eq(4)
      .within(() => {
        cy.get('[data-testid="expandable-cell"]').as("expandableCell")
        cy.get("@expandableCell").should("exist").find("button").click()
        cy.get("@expandableCell").should("exist").find("button").click()

        cy.get('[data-testid="expandable-cell-text"]')
          .should("exist")
          .should("have.text", "Lorem ipsum dolor sit amet, co...")
      })
  })
})
