import { ReportConfig } from "types/reports/Config"
import { GroupTable } from "components/Reports/GroupTable"

describe("GroupTable", () => {
  const mockConfig: ReportConfig = {
    isGrouped: true,
    groupNameKey: "category",
    dataListKey: "items",
    columns: [
      { key: "name", header: "Name" },
      { key: "value", header: "Value" }
    ]
  } as ReportConfig

  const mockGroups = [
    {
      category: "Hardware",
      items: [
        { name: "Mouse", value: 25 },
        { name: "Keyboard", value: 50 }
      ]
    },
    {
      category: "Software",
      items: [{ name: "IDE", value: 200 }]
    }
  ]

  it("renders nothing if isGrouped is false", () => {
    const ungroupedConfig = { ...mockConfig, isGrouped: false } as ReportConfig
    cy.mount(<GroupTable config={ungroupedConfig} groups={mockGroups} />)
    cy.get("table").should("not.exist")
  })

  it("renders the correct number of tables based on groups", () => {
    cy.mount(<GroupTable config={mockConfig} groups={mockGroups} />)
    cy.get("table").should("have.length", 2)
  })

  it("renders the correct group names in headers", () => {
    cy.mount(<GroupTable config={mockConfig} groups={mockGroups} />)
    cy.get("table").eq(0).should("contain.text", "Hardware")
    cy.get("table").eq(1).should("contain.text", "Software")
  })

  it("renders the correct number of rows within each grouped table", () => {
    cy.mount(<GroupTable config={mockConfig} groups={mockGroups} />)

    cy.get("table").eq(0).find("tbody tr").should("have.length", 2)
    cy.get("table").eq(1).find("tbody tr").should("have.length", 1)
  })

  it("handles groups with missing or invalid data lists gracefully", () => {
    const corruptGroups = [
      { category: "Empty Group", items: null },
      { category: "Invalid Group", items: "not-an-array" }
    ]

    cy.mount(<GroupTable config={mockConfig} groups={corruptGroups} />)

    cy.get("table").should("have.length", 2)
    cy.get("table").find("tbody tr").should("have.length", 0)
  })

  it("falls back to empty string if groupNameKey is missing in data", () => {
    const missingNameGroups = [{ items: [{ name: "Ghost", value: 0 }] }]
    cy.mount(<GroupTable config={mockConfig} groups={missingNameGroups} />)

    cy.get("table").first().find("thead").should("exist")
    // Should render a row but the text will be empty/dash based on HeaderCell logic
    cy.get("table").first().find("tr").first().should("not.have.text", "Hardware")
  })
})
