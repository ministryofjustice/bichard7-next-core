import { ReportSelectionFilter } from "components/SearchFilters/ReportSelectionFilter/ReportSelectionFilter"

describe("ReportSelectionFilter", () => {
  it("renders the correct fields for report selection filter page", () => {
    cy.mount(<ReportSelectionFilter />)

    //cy.contains("nav a", "Audit").should("not.exist")
    //cy.get("select").should("exist")
  })
})
