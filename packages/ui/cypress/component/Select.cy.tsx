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
})
