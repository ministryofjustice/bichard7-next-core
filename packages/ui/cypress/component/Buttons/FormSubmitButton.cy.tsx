import FormSubmitButton from "@/components/Buttons/FormSubmitButton"
import * as ReactDOM from "react-dom"

let formStatusStub: sinon.SinonStub

beforeEach(() => {
  formStatusStub = cy.stub(ReactDOM, "useFormStatus").returns({ pending: false })
})

describe("FormSubmitButton", () => {
  it("mounts", () => {
    cy.mount(<FormSubmitButton>{"Text"}</FormSubmitButton>)
  })

  it("renders text", () => {
    cy.mount(<FormSubmitButton>{"Text"}</FormSubmitButton>)
    cy.get("button").should("have.text", "Text")
  })

  it("has submit type by default", () => {
    cy.mount(<FormSubmitButton>{"Text"}</FormSubmitButton>)
    cy.get("button").should("have.attr", "type", "submit")
  })

  it("is not disabled by default", () => {
    cy.mount(<FormSubmitButton>{"Text"}</FormSubmitButton>)
    cy.get("button").should("not.be.disabled")
  })

  it("is disabled when disabled prop is true", () => {
    cy.mount(<FormSubmitButton disabled={true}>{"Text"}</FormSubmitButton>)
    cy.get("button").should("be.disabled")
  })

  it("is disabled when form is pending", () => {
    formStatusStub.returns({ pending: true })

    cy.mount(<FormSubmitButton>{"Text"}</FormSubmitButton>)
    cy.get("button").should("be.disabled")
  })

  it("passes down other attributes", () => {
    cy.mount(
      <FormSubmitButton id="button-id" name="button-name">
        {"Text"}
      </FormSubmitButton>
    )
    cy.get("button").should("have.attr", "id", "button-id").and("have.attr", "name", "button-name")
  })
})
