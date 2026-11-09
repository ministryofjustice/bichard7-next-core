import { CommunitySentenceResultCodesFilter } from "@/features/ReportSelectionFilter/CommunitySentenceResultCodesFilter"
import { TRPR0031_RESULTS } from "@moj-bichard7/common/utils/triggerConstants"

describe("<CommunitySentenceResultCodesFilter />", () => {
  it("renders the heading and default state without an error message", () => {
    const onChangeStub = cy.stub().as("onChange")

    cy.mount(<CommunitySentenceResultCodesFilter onChange={onChangeStub} selectedResultCodes={[]} />)

    cy.get("h2.govuk-heading-m").should("have.text", "Result codes")
    cy.get(".govuk-error-message").should("not.exist")
    cy.get(".govuk-form-group--error").should("not.exist")
  })

  it("displays the error message and error styling when error prop is provided", () => {
    const errorMessage = "Select at least one result code"

    cy.mount(<CommunitySentenceResultCodesFilter onChange={cy.stub()} error={errorMessage} selectedResultCodes={[]} />)

    cy.get(".govuk-error-message").should("be.visible").and("contain.text", errorMessage)

    cy.get(".govuk-visually-hidden").should("have.text", "Error:")
  })

  it("pre-selects the checkboxes corresponding to selectedResultCodes", () => {
    const initialSelection = TRPR0031_RESULTS.slice(0, 2).map((option) => option.id)

    cy.mount(<CommunitySentenceResultCodesFilter onChange={cy.stub()} selectedResultCodes={initialSelection} />)

    initialSelection.forEach((code) => {
      cy.get(`input[type="checkbox"][value="${code}"]`).should("be.checked")
    })
  })

  it("calls onChange with updated result code array when a checkbox is toggled", () => {
    const onChangeStub = cy.stub().as("onChange")
    const firstCode = [TRPR0031_RESULTS[0].id]

    cy.mount(<CommunitySentenceResultCodesFilter onChange={onChangeStub} selectedResultCodes={[]} />)

    cy.get(`input[type="checkbox"][value="${firstCode}"]`).check({ force: true })

    cy.get("@onChange").should("have.been.calledOnce")
    cy.get("@onChange").should("have.been.calledWith", firstCode)
  })
})
