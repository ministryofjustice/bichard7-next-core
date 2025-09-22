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

  it("passes selected value to onChange", () => {
    const onChangeSpy = cy.spy().as("onChange")
    cy.mount(<ExceptionQualityDropdown onChange={onChangeSpy} />)

    cy.get("select").select(String(Object.values(exceptionQualityValues)[0]))
    cy.get("@onChange").should("have.been.called")
  })
})
