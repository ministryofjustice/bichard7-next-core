import ColumnOrderIcons from "../../src/features/CourtCaseFilters/ColumnOrderIcons"

describe("ColumnOrderIcons.cy.tsx", () => {
  it("up arrow", () => {
    cy.mount(<ColumnOrderIcons columnName={"defendantName"} currentOrder={"asc"} orderBy={"defendantName"} />)
    cy.get(".upArrow").should("exist")
  })
  it("down arrow", () => {
    cy.mount(<ColumnOrderIcons columnName={"defendantName"} currentOrder={"desc"} orderBy={"defendantName"} />)
    cy.get(".downArrow").should("exist")
  })
  it("unordered arrows", () => {
    cy.mount(<ColumnOrderIcons columnName={"defendantName"} currentOrder={"asc"} orderBy={"courtName"} />)
    cy.get(".unorderedArrow").should("exist")
  })
})
