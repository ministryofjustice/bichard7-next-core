import { Label } from "components/Label"

describe("Label", () => {
  it("mounts", () => {
    cy.mount(<Label>{"Text"}</Label>)
  })

  it("renders text", () => {
    cy.mount(<Label>{"Text"}</Label>)
    cy.get("label").should("have.text", "Text")
  })

  it("merges class names", () => {
    cy.mount(<Label className="extra-class">{"Text"}</Label>)
    cy.get("label").should("have.class", "govuk-label").should("have.class", "extra-class")
  })

  it("renders different sizes", () => {
    for (const size of ["s", "m", "l", "xl"]) {
      cy.mount(<Label size={size}>{"Text"}</Label>)
      cy.get("label").should("have.class", "govuk-label").should("have.class", `govuk-label--${size}`)
    }
  })
})
