import Details from "@/components/Details/Details"

describe("<Details />", () => {
  it("prepends 'Show' when the summary has no Show/Hide prefix", () => {
    cy.mount(
      <Details id="active-users" summary="active users">
        <p>{"Some detail content"}</p>
      </Details>
    )

    cy.get(".govuk-details__summary-text").should("have.text", "Show active users")
  })

  it("toggles between 'Show' and 'Hide' on click when summary has no prefix", () => {
    cy.mount(
      <Details id="active-users" summary="active users">
        <p>{"Some detail content"}</p>
      </Details>
    )

    cy.get(".govuk-details__summary-text").should("have.text", "Show active users")

    cy.get(".govuk-details__summary").click()
    cy.get(".govuk-details__summary-text").should("have.text", "Hide active users")

    cy.get(".govuk-details__summary").click()
    cy.get(".govuk-details__summary-text").should("have.text", "Show active users")
  })

  it("swaps an existing 'Show' prefix to 'Hide' on click", () => {
    cy.mount(
      <Details id="active-users" summary="Show active users">
        <p>{"Some detail content"}</p>
      </Details>
    )

    cy.get(".govuk-details__summary-text").should("have.text", "Show active users")

    cy.get(".govuk-details__summary").click()
    cy.get(".govuk-details__summary-text").should("have.text", "Hide active users")
  })

  it("handles case insensitive show/hide", () => {
    cy.mount(
      <Details id="active-users" summary="show active users">
        <p>{"Some detail content"}</p>
      </Details>
    )

    cy.get(".govuk-details__summary-text").should("have.text", "Show active users")

    cy.get(".govuk-details__summary").click()
    cy.get(".govuk-details__summary-text").should("have.text", "Hide active users")
  })

  it("normalises an existing 'Hide' prefix to match current state", () => {
    cy.mount(
      <Details id="active-users" summary="Hide active users">
        <p>{"Some detail content"}</p>
      </Details>
    )

    cy.get(".govuk-details__summary-text").should("have.text", "Show active users")

    cy.get(".govuk-details__summary").click()
    cy.get(".govuk-details__summary-text").should("have.text", "Hide active users")
  })

  it("renders the children content", () => {
    cy.mount(
      <Details id="active-users" summary="active users">
        <p>{"Some detail content"}</p>
      </Details>
    )

    cy.get(".govuk-details__text").should("contain.text", "Some detail content")
  })

  it("sets id, class and data-module on the root element", () => {
    cy.mount(
      <Details id="my-details-id" summary="active users">
        <p>{"Some detail content"}</p>
      </Details>
    )

    cy.get("#my-details-id").should("have.class", "govuk-details").and("have.attr", "data-module", "govuk-details")
  })
})
