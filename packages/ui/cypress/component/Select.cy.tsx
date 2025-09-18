import { Select } from "components/Select"

describe("Select", () => {
  it("mounts", () => {
    cy.mount(
      <Select>
        <option value="value1">{"Value 1"}</option>
        <option value="value2">{"Value 2"}</option>
      </Select>
    )
  })

  it("renders options", () => {
    cy.mount(
      <Select>
        <option value="value1">{"Value 1"}</option>
        <option value="value2">{"Value 2"}</option>
      </Select>
    )

    cy.get("select option").should("have.length", 2)
  })

  it("merges class names", () => {
    cy.mount(
      <Select className="extra-class">
        <option value="value1">{"Value 1"}</option>
        <option value="value2">{"Value 2"}</option>
      </Select>
    )

    cy.get("select").should("have.class", "govuk-select").should("have.class", "extra-class")
  })

  it("passed in value is selected", () => {
    cy.mount(
      <Select value="value2" placeholder="Select a value">
        <option value="value1">{"Value 1"}</option>
        <option value="value2">{"Value 2"}</option>
      </Select>
    )

    cy.get("select").should("have.value", "value2")
  })

  it("selecting an option fires a change event", () => {
    const onChangeSpy = cy.spy().as("onChangeSpy")

    cy.mount(
      <Select onChange={onChangeSpy}>
        <option value="value1">{"Value 1"}</option>
        <option value="value2">{"Value 2"}</option>
      </Select>
    )

    cy.get("select").select("value2")
    cy.get("@onChangeSpy").should("have.been.called")
  })

  it("renders placeholder", () => {
    cy.mount(
      <Select value="" placeholder="Select a value">
        <option value="value1">{"Value 1"}</option>
        <option value="value2">{"Value 2"}</option>
      </Select>
    )

    cy.get("select option").should("have.length", 3)
    cy.get("select option:first-child").should("have.value", "").should("contain.text", "Select a value")
  })

  it("shows error state", () => {
    cy.mount(
      <Select showError>
        <option value="value1">{"Value 1"}</option>
        <option value="value2">{"Value 2"}</option>
      </Select>
    )

    cy.get("select").should("have.class", "govuk-select").should("have.class", "govuk-select--error")
  })
})
