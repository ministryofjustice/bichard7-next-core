import { NestedTable } from "components/Reports/NestedTable"
import { ReportConfig } from "types/reports/Config"

describe("NestedTable", () => {
  const mockConfig = {
    structure: "nested",
    outerGroupNameKey: "region",
    outerDataListKeys: ["itTeams", "hrTeams"],
    innerGroupNameKey: "teamName",
    innerDataListKey: "members",
    columns: [[{ key: "devName", header: "Developer" }], [{ key: "hrName", header: "HR Rep" }]],
    totalsConfig: [{ key: "headcount", label: "Count" }]
  } as unknown as ReportConfig

  const mockGroups = [
    {
      region: "North",
      itTeams: [
        {
          teamName: "Alpha",
          members: [{ devName: "Alice" }, { devName: "Bob" }],
          totals: { headcount: 2 }
        }
      ],
      hrTeams: [
        {
          teamName: "People Ops",
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

  it("maps the correct columns based on the outerDataListKeys index", () => {
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
        itTeams: "not-an-array"
      }
    ]

    cy.mount(<NestedTable config={mockConfig} groups={corruptGroups} />)

    cy.get("table").should("have.length", 0)
  })

  it("handles missing totals gracefully", () => {
    const noTotalsGroup = [
      {
        region: "West",
        itTeams: [{ teamName: "No Totals", members: [{ devName: "Dave" }] }]
      }
    ]

    cy.mount(<NestedTable config={mockConfig} groups={noTotalsGroup} />)

    cy.get("h3")
      .contains("No Totals")
      .then(($h3) => {
        expect($h3.text()).to.not.contain("Count:")
      })
  })
})
