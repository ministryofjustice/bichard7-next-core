import CollapsibleContainer from "@/components/Reports/CollapsibleContainer"

describe("CollapsibleContainer", () => {
  const mockTotalsConfig = [{ key: "amount", label: "Total" }]
  const mockTotals = { amount: 500 }
  const indexedKey = "test-group-1"

  it("renders an h3 header if h3 is specified", () => {
    cy.mount(
      <CollapsibleContainer
        headingName="GroupName"
        indexedKey={indexedKey}
        totalsConfig={mockTotalsConfig}
        totals={mockTotals}
        headerType="h3"
      >
        <div>{"Content"}</div>
      </CollapsibleContainer>
    )

    cy.get("h3").should("exist")
  })

  it("renders an h4 header if h4 is specified", () => {
    cy.mount(
      <CollapsibleContainer
        headingName="GroupName"
        indexedKey={indexedKey}
        totalsConfig={mockTotalsConfig}
        totals={mockTotals}
        headerType="h4"
      >
        <div>{"Content"}</div>
      </CollapsibleContainer>
    )

    cy.get("h4").should("exist")
  })

  it("renders correctly and is expanded by default when children exist", () => {
    cy.mount(
      <CollapsibleContainer
        headingName="GroupName"
        indexedKey={indexedKey}
        totalsConfig={mockTotalsConfig}
        totals={mockTotals}
        headerType="h3"
      >
        <div data-testid="child-item">{"Child Content"}</div>
      </CollapsibleContainer>
    )

    cy.get("h3").should("contain.text", "GroupName")
    cy.get("[data-testid='child-item']").should("be.visible")
    cy.get("[data-testid='accordion-toggle']").should("contain.text", "Hide")
  })

  it("collapses and expands when the header is clicked", () => {
    cy.mount(
      <CollapsibleContainer headingName="GroupName" indexedKey={indexedKey} headerType="h3">
        <div data-testid="child-item">{"Table"}</div>
      </CollapsibleContainer>
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
      <CollapsibleContainer headingName="Empty Group" indexedKey={indexedKey} headerType="h3">
        {null}
      </CollapsibleContainer>
    )

    cy.get("[data-testid='accordion-toggle']").should("not.exist")
    cy.contains("Show").should("not.exist")
    cy.contains("Hide").should("not.exist")

    cy.get("[data-testid='accordion-content']").should("not.exist")
  })

  it("uses the indexedKey to set correct IDs for accessibility", () => {
    cy.mount(
      <CollapsibleContainer headingName="Accessibility test" indexedKey="unique-id" headerType="h3">
        <div>{"Content"}</div>
      </CollapsibleContainer>
    )

    cy.get("section").should("have.id", "unique-id-section").should("have.attr", "aria-labelledby", "unique-id-header")
    cy.get("h3").should("have.id", "unique-id-header")
    cy.get("[data-testid='accordion-header-wrapper']").should("have.attr", "aria-controls", "unique-id-content")
    cy.get("[data-testid='accordion-content']")
      .should("have.id", "unique-id-content")
      .should("have.attr", "aria-labelledby", "unique-id-header")
  })

  it("renders totals within the header if provided", () => {
    cy.mount(
      <CollapsibleContainer
        headingName="GroupName"
        indexedKey={indexedKey}
        totalsConfig={[{ key: "val", label: "Sum" }]}
        totals={{ val: 1000 }}
        headerType="h3"
      >
        <div>{"Content"}</div>
      </CollapsibleContainer>
    )

    cy.get("h3").should("contain.text", "GroupName")
    cy.get("h3").within(() => {
      cy.root().should("contain.text", "1000")
    })
  })
})
