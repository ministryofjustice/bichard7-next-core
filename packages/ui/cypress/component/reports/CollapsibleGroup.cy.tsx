import CollapsibleGroup from "@/components/Reports/CollapsibleGroup"

describe("CollapsibleGroup", () => {
  const mockTotalsConfig = [{ key: "amount", label: "Total" }]
  const mockTotals = { amount: 500 }
  const indexedKey = "test-group-1"

  it("renders correctly and is expanded by default when children exist", () => {
    cy.mount(
      <CollapsibleGroup
        groupName="GroupName"
        indexedKey={indexedKey}
        totalsConfig={mockTotalsConfig}
        totals={mockTotals}
      >
        <div data-testid="child-item">{"Child Content"}</div>
      </CollapsibleGroup>
    )

    cy.get("h3").should("contain.text", "GroupName")
    cy.get("[data-testid='child-item']").should("be.visible")
    cy.get("[data-testid='accordion-toggle']").should("contain.text", "Hide")
  })

  it("collapses and expands when the header is clicked", () => {
    cy.mount(
      <CollapsibleGroup groupName="GroupName" indexedKey={indexedKey}>
        <div data-testid="child-item">{"Table"}</div>
      </CollapsibleGroup>
    )

    cy.get("[data-testid='accordion-header-wrapper']").as("accordion-header-wrapper").click()
    cy.get("[data-testid='child-item']").should("not.exist")
    cy.get("@accordion-header-wrapper").should("contain.text", "Show")
    cy.get("@accordion-header-wrapper").should("have.attr", "aria-expanded", "false")

    cy.get("@accordion-header-wrapper").click()
    cy.get("[data-testid='child-item']").should("exist")
    cy.get("@accordion-header-wrapper").should("contain.text", "Hide")
    cy.get("@accordion-header-wrapper").should("have.attr", "aria-expanded", "true")
  })

  it("does not render the toggle button and does not render content when there are no children", () => {
    cy.mount(
      <CollapsibleGroup groupName="Empty Group" indexedKey={indexedKey}>
        {null}
      </CollapsibleGroup>
    )

    cy.get("[data-testid='accordion-toggle']").should("not.exist")
    cy.contains("Show").should("not.exist")
    cy.contains("Hide").should("not.exist")

    cy.get("[data-testid='accordion-content']").should("not.exist")
  })

  it("uses the indexedKey to set correct IDs for accessibility", () => {
    cy.mount(
      <CollapsibleGroup groupName="Accessibility test" indexedKey="unique-id">
        <div>{"Content"}</div>
      </CollapsibleGroup>
    )

    cy.get("section").should("have.id", "unique-id-section").should("have.attr", "aria-labelledby", "unique-id-header")
    cy.get("h3").should("have.id", "unique-id-header")
    cy.get("[data-testid='accordion-header-wrapper']").should("have.attr", "aria-controls", "unique-id-content")
    cy.get("[data-testid='accordion-content']").should("have.attr", "aria-labelledby", "unique-id-header")
  })

  it("renders totals within the header if provided", () => {
    cy.mount(
      <CollapsibleGroup
        groupName="GroupName"
        indexedKey={indexedKey}
        totalsConfig={[{ key: "val", label: "Sum" }]}
        totals={{ val: 1000 }}
      >
        <div>{"Content"}</div>
      </CollapsibleGroup>
    )

    cy.get("h3").should("contain.text", "GroupName")
    cy.get("h3").within(() => {
      cy.root().should("contain.text", "1000")
    })
  })
})
