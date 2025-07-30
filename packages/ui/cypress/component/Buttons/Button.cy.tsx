import { Button } from "../../../src/components/Buttons/Button"

describe("Button", () => {
  it("mounts", () => {
    cy.mount(<Button>{"Text"}</Button>)
  })

  it("merges class names", () => {
    cy.mount(<Button className="extra-class">{"Text"}</Button>)
    cy.get("button").should("have.class", "govuk-button").should("have.class", "extra-class")
  })
})
