import { ReportTableHeaderCell } from "components/Reports/ReportTableHeaderCell"

describe("ReportTableHeaderCell", () => {
  it("renders children correctly", () => {
    cy.mount(
      <table>
        <thead>
          <tr>
            <ReportTableHeaderCell>{"Column Title"}</ReportTableHeaderCell>
          </tr>
        </thead>
      </table>
    )

    cy.get("th, td").should("have.text", "Column Title")
  })

  it("applies the colSpan attribute when provided", () => {
    cy.mount(
      <table>
        <thead>
          <tr>
            <ReportTableHeaderCell colSpan={5}>{"Merged Cell"}</ReportTableHeaderCell>
          </tr>
        </thead>
      </table>
    )

    cy.get("th, td").should("have.attr", "colspan", "5")
  })

  it("handles the isGroupHeader prop", () => {
    cy.mount(
      <table>
        <thead>
          <tr>
            <ReportTableHeaderCell isGroupHeader={true}>{"Group Header"}</ReportTableHeaderCell>
          </tr>
        </thead>
      </table>
    )

    cy.get("th, td").should("have.text", "Group Header")
  })

  it("renders without colSpan by default", () => {
    cy.mount(
      <table>
        <thead>
          <tr>
            <ReportTableHeaderCell>{"Default Cell"}</ReportTableHeaderCell>
          </tr>
        </thead>
      </table>
    )

    cy.get("th, td").should("not.have.attr", "colspan")
  })
})
