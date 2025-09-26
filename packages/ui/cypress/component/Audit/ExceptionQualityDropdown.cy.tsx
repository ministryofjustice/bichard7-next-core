import { ExceptionQualityDropdown } from "features/CourtCaseDetails/Sidebar/Audit/ExceptionQualityDropdown"
import { exceptionQualityValues } from "@moj-bichard7/common/types/ExceptionQuality"
import "../../../styles/globals.scss"

describe("ExceptionQualityDropdown", () => {
  it("mounts", () => {
    cy.mount(<ExceptionQualityDropdown />)
  })

  it("renders options", () => {
    cy.mount(<ExceptionQualityDropdown />)

    cy.get("option").should("have.length", Object.keys(exceptionQualityValues).length)
  })

  it("doesn't render not checked option", () => {
    cy.mount(<ExceptionQualityDropdown />)

    cy.get("select").find("option[value='1']").should("not.exist")
  })

  it("renders placeholder", () => {
    cy.mount(<ExceptionQualityDropdown />)

    cy.get("select").find(":selected").should("have.text", "Set Exception Quality")
  })

  it("shows error message when showError is true", () => {
    cy.mount(<ExceptionQualityDropdown showError={true} />)

    cy.get("#exception-quality-error").should("be.visible")
    cy.get("select").should("have.attr", "aria-describedby", "exception-quality-error")
  })

  it("doesnt show error message when showError is false", () => {
    cy.mount(<ExceptionQualityDropdown showError={false} />)

    cy.get("select") // Add so component mounted before checking for errors
    cy.get("#exception-quality-error").should("not.exist")
    cy.get("select").should("not.have.attr", "aria-describedby")
  })
})
