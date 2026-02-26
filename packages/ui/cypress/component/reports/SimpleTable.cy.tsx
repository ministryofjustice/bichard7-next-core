import { ReportConfig } from "types/reports/Config"
import { SimpleTable } from "components/Reports/SimpleTable"

describe("SimpleTable", () => {
  const mockConfig: ReportConfig = {
    columns: [
      { key: "name", header: "Product" },
      { key: "price", header: "Price" }
    ]
  } as ReportConfig

  const mockRows = [
    { name: "Widget", price: 10 },
    { name: "Gadget", price: 20 }
  ]

  it("renders the table structure", () => {
    cy.mount(<SimpleTable config={mockConfig} rows={mockRows} />)
    cy.get("table").should("be.visible")
  })

  it("renders the header with correct columns", () => {
    cy.mount(<SimpleTable config={mockConfig} rows={mockRows} />)
    cy.get("thead th, thead td").should("have.length", 2)
    cy.get("thead").should("contain", "Product").and("contain", "Price")
  })

  it("renders the body with the correct number of rows", () => {
    cy.mount(<SimpleTable config={mockConfig} rows={mockRows} />)
    cy.get("tbody tr").should("have.length", 2)
  })

  it("displays the correct row data", () => {
    cy.mount(<SimpleTable config={mockConfig} rows={mockRows} />)
    cy.get("tbody tr").first().should("contain", "Widget").and("contain", "10")
    cy.get("tbody tr").last().should("contain", "Gadget").and("contain", "20")
  })

  it("renders an empty body when rows are empty", () => {
    cy.mount(<SimpleTable config={mockConfig} rows={[]} />)
    cy.get("tbody tr").should("have.length", 0)
    cy.get("thead").should("exist")
  })

  it("applies the expected layout styles", () => {
    cy.mount(<SimpleTable config={mockConfig} rows={mockRows} />)
    cy.get("table").should("have.css", "width").and("match", /px|%/)
    cy.get("table").should("have.css", "border-collapse", "collapse")
  })
})
