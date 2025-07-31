import { Button } from "../../../src/components/Buttons/Button"

describe("Button", () => {
  it("mounts", () => {
    cy.mount(<Button>{"Text"}</Button>)
  })

  it("renders text", () => {
    cy.mount(<Button>{"Text"}</Button>)
    cy.get("button").should("have.text", "Text")
  })

  it("merges class names", () => {
    cy.mount(<Button className="extra-class">{"Text"}</Button>)
    cy.get("button").should("have.class", "govuk-button").should("have.class", "extra-class")
  })
})
