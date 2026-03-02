import React from "react"
import { Loading } from "components/Loading"

describe("<Loading />", () => {
  it("renders with the default text", () => {
    cy.mount(<Loading />)

    cy.get(".govuk-heading-m").should("have.text", "Loading Case Details...")

    cy.get(".loading-spinner").should("exist")
    cy.get(".loading-spinner__spinner").should("exist")
    cy.get(".loading-spinner__content").should("exist")
  })

  it("renders with custom text", () => {
    const customText = "Fetching user data..."
    cy.mount(<Loading text={customText} />)

    cy.get(".govuk-heading-m").should("have.text", customText)
  })

  it("has the correct accessibility attributes on the spinner", () => {
    cy.mount(<Loading />)

    cy.get(".loading-spinner__spinner").should("have.attr", "role", "status").should("have.attr", "aria-live", "polite")
  })
})
