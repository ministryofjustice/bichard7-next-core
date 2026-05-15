import { NestedTable } from "components/Reports/NestedTable"
import { ReportConfig } from "types/reports/Config"

describe("NestedTable", () => {
  const mockConfig = {
    structure: "nested",
    outerGroupNameKey: "region",
    outerDataListKey: "allTeams",
    innerGroupNameKey: "teamName",
    innerDataListKey: "members",
    columnSelectorKey: "type",
    columns: {
      IT: [{ key: "devName", header: "Developer" }],
      HR: [{ key: "hrName", header: "HR Rep" }]
    },
    totalsConfig: [{ key: "headcount", label: "Count" }]
  } as unknown as ReportConfig

  const mockGroups = [
    {
      region: "North",
      allTeams: [
        {
          teamName: "Alpha",
          type: "IT",
          members: [{ devName: "Alice" }, { devName: "Bob" }],
          totals: { headcount: 2 }
        },
        {
          teamName: "People Ops",
          type: "HR",
          members: [{ hrName: "Charlie" }],
          totals: { headcount: 1 }
        }
      ]
    }
  ]

  it("renders nothing if structure is not 'nested'", () => {
    const flatConfig = { ...mockConfig, structure: "flat" } as ReportConfig
    cy.mount(<NestedTable config={flatConfig} groups={mockGroups} />)
    cy.get("section").should("not.exist")

    const groupedConfig = { ...mockConfig, structure: "grouped" } as ReportConfig
    cy.mount(<NestedTable config={groupedConfig} groups={mockGroups} />)
    cy.get("section").should("not.exist")
  })

  it("renders outer group headers correctly", () => {
    cy.mount(<NestedTable config={mockConfig} groups={mockGroups} />)
    cy.get("h3").first().should("contain.text", "North")
  })

  it("renders inner group headers and their respective totals", () => {
    cy.mount(<NestedTable config={mockConfig} groups={mockGroups} />)

    cy.get("h3").should("contain.text", "Alpha")
    cy.get("h3").should("contain.text", "People Ops")

    cy.get("h3").should("contain.text", "Count: 2")
    cy.get("h3").should("contain.text", "Count: 1")
  })

  it("maps the correct columns based on the columnSelectorKey value", () => {
    cy.mount(<NestedTable config={mockConfig} groups={mockGroups} />)

    cy.get("table").eq(0).find("th").should("contain.text", "Developer")

    cy.get("table").eq(1).find("th").should("contain.text", "HR Rep")
  })

  it("renders the correct number of rows in the nested tables", () => {
    cy.mount(<NestedTable config={mockConfig} groups={mockGroups} />)

    cy.get("table").eq(0).find("tbody tr").should("have.length", 2)
    cy.get("table").eq(1).find("tbody tr").should("have.length", 1)
  })

  it("filters out invalid inner groups gracefully", () => {
    const corruptGroups = [
      {
        region: "South",
        allTeams: "not-an-array"
      }
    ]

    cy.mount(<NestedTable config={mockConfig} groups={corruptGroups} />)

    cy.get("table").should("have.length", 0)
  })

  it("handles missing totals gracefully", () => {
    const noTotalsGroup = [
      {
        region: "West",
        allTeams: [
          {
            teamName: "No Totals",
            type: "IT",
            members: [{ devName: "Dave" }]
          }
        ]
      }
    ]

    cy.mount(<NestedTable config={mockConfig} groups={noTotalsGroup} />)

    cy.get("h3").contains("No Totals").invoke("text").should("not.contain", "Count:")
  })
})
