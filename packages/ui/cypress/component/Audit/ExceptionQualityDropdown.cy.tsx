import { ExceptionQualityDropdown } from "features/CourtCaseDetails/Sidebar/Audit/ExceptionQualityDropdown"
import { exceptionQualityValues } from "@moj-bichard7/common/types/ExceptionQuality"

describe("ExceptionQualityDropdown", () => {
  it("mounts", () => {
    cy.mount(<ExceptionQualityDropdown value={1} />)
  })

  it("renders options", () => {
    cy.mount(<ExceptionQualityDropdown value={1} />)

    cy.get("option").should("have.length", Object.keys(exceptionQualityValues).length + 1)
  })

  it("renders placeholder if null", () => {
    cy.mount(<ExceptionQualityDropdown value={null} />)

    cy.get("select").find(":selected").should("have.text", "Set Exception Quality")
  })
})
