import { TriggerQualityDropdown } from "features/CourtCaseDetails/Sidebar/Audit/TriggerQualityDropdown"
import { triggerQualityValues } from "@moj-bichard7/common/types/TriggerQuality"

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
    cy.mount(<TriggerQualityDropdown value={null} />)

    cy.get("select").find(":selected").should("have.text", "Set Trigger Quality")
  })

  it("passes selected value to onChange", () => {
    const onChangeSpy = cy.spy().as("onChange")
    cy.mount(<TriggerQualityDropdown onChange={onChangeSpy} />)

    const selectedValue = Object.values(triggerQualityValues)[0]
    cy.get("select").select(selectedValue)
    cy.get("@onChange").should("have.been.calledOnceWith", Number(selectedValue))
  })
})
