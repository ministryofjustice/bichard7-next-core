import ExpandableCell from "@/components/Reports/ExpandableCell"

describe("<ReportTableRow />", () => {
  const shortText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
  const longText =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  const abbreviatedText = "Lorem ipsum dolor sit amet, co..."

  it("renders abbreviated text and 'show more' button for long text", () => {
    cy.mount(<ExpandableCell content={longText} />)

    cy.get('[data-testid="expandable-cell"]').as("expandableCell")
    cy.get("@expandableCell").should("exist").find("button").should("exist").and("have.text", "show more")

    cy.get('[data-testid="expandable-cell-text"]').should("exist").should("have.text", abbreviatedText)
  })

  it("renders full text and doesn't render expandable cell for short text", () => {
    cy.mount(<ExpandableCell content={shortText} />)
    cy.get('[data-testid="expandable-cell"]').should("not.exist")
    cy.get("div").should("have.text", shortText)
  })

  it("renders react component when one is passed in", () => {
    const content: React.ReactNode = <div data-testid="test-div"></div>
    cy.mount(<ExpandableCell content={content} />)
    cy.get('[data-testid="test-div"]').should("exist")
  })

  it("renders full text when 'show more' button is clicked", () => {
    cy.mount(<ExpandableCell content={longText} />)

    cy.get('[data-testid="expandable-cell"]').as("expandableCell")
    cy.get("@expandableCell").should("exist").find("button").click()

    cy.get("@expandableCell")
      .should("exist")
      .should(
        "have.text",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.show less"
      )

    cy.get("@expandableCell").should("contain", "show less")
  })

  it("renders abbreviated text when 'show less' button is clicked", () => {
    cy.mount(<ExpandableCell content={longText} />)

    cy.get('[data-testid="expandable-cell"]').as("expandableCell")
    cy.get("@expandableCell").should("exist").find("button").click()
    cy.get("@expandableCell").should("exist").find("button").click()

    cy.get('[data-testid="expandable-cell-text"]').should("exist").should("have.text", abbreviatedText)
  })
})
