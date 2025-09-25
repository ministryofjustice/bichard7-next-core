import { TriggerQualityDropdown } from "features/CourtCaseDetails/Sidebar/Audit/TriggerQualityDropdown"
import { triggerQualityValues } from "@moj-bichard7/common/types/TriggerQuality"
import "../../../styles/globals.scss"

describe("TriggerQualityDropdown", () => {
  it("mounts", () => {
    cy.mount(<TriggerQualityDropdown value={1} />)
  })

  it("renders options", () => {
    cy.mount(<TriggerQualityDropdown value={1} />)

    cy.get("option").should("have.length", Object.keys(triggerQualityValues).length + 1)
  })

  it("renders options in order", () => {
    cy.mount(<TriggerQualityDropdown value={1} />)

    cy.get("option").then((options) => {
      const values = options.toArray().map((option) => Number(option.value))
      const sortedValues = [...values].sort((a, b) => a - b)
      expect(values).to.deep.equal(sortedValues)
    })
  })

  it("renders placeholder if null", () => {
    cy.mount(<TriggerQualityDropdown />)

    cy.get("select").find(":selected").should("have.text", "Set Trigger Quality")
  })

  it("shows error message when showError is true", () => {
    cy.mount(<TriggerQualityDropdown showError={true} />)

    cy.get("#trigger-quality-error").should("be.visible")
    cy.get("select").should("have.attr", "aria-describedby", "trigger-quality-error")
  })

  it("doesnt show error message when showError is false", () => {
    cy.mount(<TriggerQualityDropdown showError={false} />)

    cy.get("select") // Add so component mounted before checking for errors
    cy.get("#trigger-quality-error").should("not.exist")
    cy.get("select").should("not.have.attr", "aria-describedby")
  })
})
