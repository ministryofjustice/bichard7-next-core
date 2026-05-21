import { GroupTable } from "components/Reports/GroupTable"
import { GroupedReportConfig } from "types/reports/Config"

type TestRow = { name: string; value: number }
type TestTable = {
  category: string
  items: TestRow[]
  totals: { totalValue: number }
}

describe("GroupTable", () => {
  const mockConfig: GroupedReportConfig<TestTable, TestRow> = {
    structure: "grouped",
    endpoint: "/api/test",
    reportType: "bails",
    tableNameKey: "category",
    tableDataListKey: "items",
    columns: [
      { key: "name", header: "Name" },
      { key: "value", header: "Value" }
    ],
    totalsConfig: [{ key: "totalValue", label: "Total Value" }]
  }

  const mockGroups = [
    {
      category: "Hardware",
      items: [
        { name: "Mouse", value: 25 },
        { name: "Keyboard", value: 50 }
      ],
      totals: { totalValue: 75 }
    },
    {
      category: "Software",
      items: [{ name: "IDE", value: 200 }],
      totals: { totalValue: 200 }
    }
  ]

  it("renders nothing if structure is 'flat'", () => {
    const ungroupedConfig = { ...mockConfig, structure: "flat" }

    // @ts-expect-error - Intentionally passing an invalid config to test the runtime guard
    cy.mount(<GroupTable config={ungroupedConfig} tables={mockGroups} />)
    cy.get("table").should("not.exist")
  })

  it("renders the correct number of tables based on groups", () => {
    cy.mount(<GroupTable config={mockConfig} tables={mockGroups} />)
    cy.get("table").should("have.length", 2)
  })

  it("renders the correct group names in headers", () => {
    cy.mount(<GroupTable config={mockConfig} tables={mockGroups} />)
    cy.get("h3").eq(0).should("contain.text", "Hardware")
    cy.get("h3").eq(1).should("contain.text", "Software")
  })

  it("renders the totals when totalsConfig and totals data are present", () => {
    cy.mount(<GroupTable config={mockConfig} tables={mockGroups} />)

    cy.get("h3").eq(0).should("contain.text", "Total Value: 75")
    cy.get("h3").eq(1).should("contain.text", "Total Value: 200")
  })

  it("renders the correct number of rows within each grouped table", () => {
    cy.mount(<GroupTable config={mockConfig} tables={mockGroups} />)

    cy.get("table").eq(0).find("tbody tr").should("have.length", 2)
    cy.get("table").eq(1).find("tbody tr").should("have.length", 1)
  })

  it("handles groups with missing or invalid data lists gracefully", () => {
    const corruptGroups = [
      { category: "Empty Group", items: null },
      { category: "Invalid Group", items: "not-an-array" }
    ]

    // @ts-expect-error - Intentionally passing an invalid config to test the runtime guard
    cy.mount(<GroupTable config={mockConfig} tables={corruptGroups} />)

    cy.get("table").should("have.length", 2)
    cy.get("table").find("tbody tr").should("have.length", 0)
  })

  it("falls back to empty string if tableNameKey is missing in data", () => {
    const missingNameGroups = [{ items: [{ name: "Ghost", value: 0 }] }]

    // @ts-expect-error - Intentionally passing an invalid config to test the runtime guard
    cy.mount(<GroupTable config={mockConfig} tables={missingNameGroups} />)

    cy.get("h3").first().should("exist").and("not.contain.text", "Hardware")
  })
})
