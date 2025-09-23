import { ExceptionQualityDropdown } from "features/CourtCaseDetails/Sidebar/Audit/ExceptionQualityDropdown"
import { exceptionQualityValues } from "@moj-bichard7/common/types/ExceptionQuality"
import "../../../styles/globals.scss"

describe("ExceptionQualityDropdown", () => {
  it("mounts", () => {
    cy.mount(<ExceptionQualityDropdown value={1} />)
  })

  it("renders options", () => {
    cy.mount(<ExceptionQualityDropdown value={1} />)

    cy.get("option").should("have.length", Object.keys(exceptionQualityValues).length + 1)
  })

  it("renders options in order", () => {
    cy.mount(<ExceptionQualityDropdown value={1} />)

    cy.get("option").then((options) => {
      const values = options.toArray().map((option) => Number(option.value))
      const sortedValues = [...values].sort((a, b) => a - b)
      expect(values).to.deep.equal(sortedValues)
    })
  })

  it("renders placeholder", () => {
    cy.mount(<ExceptionQualityDropdown />)

    cy.get("select").find(":selected").should("have.text", "Set Exception Quality")
  })

  it("shows error message when showError is true", () => {
    cy.mount(<ExceptionQualityDropdown showError={true} />)

    cy.get("#exception-quality-error").should("be.visible")
  })

  it("doesnt show error message when showError is false", () => {
    cy.mount(<ExceptionQualityDropdown showError={false} />)

    cy.get("select") // Add so component mounted before checking for errors
    cy.get("#exception-quality-error").should("not.exist")
  })
})
