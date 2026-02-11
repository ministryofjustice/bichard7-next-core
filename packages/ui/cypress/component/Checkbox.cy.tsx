import Checkbox from "../../src/components/Checkbox/Checkbox"

describe("Checkbox", () => {
  it("mounts", () => {
    cy.mount(<Checkbox name={"checkbox"} label={"Checkbox"} checked={true} />)
  })

  it("should set the label text", () => {
    cy.mount(<Checkbox name={"checkbox"} label={"Label text"} checked={true} />)

    cy.get("label").should("have.text", "Label text")
  })

  it("should set the checked state", () => {
    cy.mount(<Checkbox name={"checkbox"} label={"Label text"} checked={true} />)

    cy.get("input").should("be.checked")
  })
})
