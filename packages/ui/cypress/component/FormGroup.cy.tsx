import { FormGroup } from "components/FormGroup"

describe("FormGroup", () => {
  it("mounts", () => {
    cy.mount(<FormGroup id={"my-form-group"}>{"Text"}</FormGroup>)
  })

  it("renders children", () => {
    cy.mount(<FormGroup id={"my-form-group"}>{"Text"}</FormGroup>)
    cy.get("div#my-form-group").should("have.text", "Text")
  })

  it("merges class names", () => {
    cy.mount(
      <FormGroup id={"my-form-group"} className="extra-class">
        {"Text"}
      </FormGroup>
    )
    cy.get("div#my-form-group").should("have.class", "govuk-form-group").should("have.class", "extra-class")
  })

  it("shows error state", () => {
    cy.mount(
      <FormGroup id={"my-form-group"} showError>
        {"Text"}
      </FormGroup>
    )
    cy.get("div#my-form-group").should("have.class", "govuk-form-group").should("have.class", "govuk-form-group--error")
  })

  it("does not show error state", () => {
    cy.mount(
      <FormGroup id={"my-form-group"} showError={false}>
        {"Text"}
      </FormGroup>
    )
    cy.get("div#my-form-group")
      .should("have.class", "govuk-form-group")
      .should("not.have.class", "govuk-form-group--error")
  })
})
