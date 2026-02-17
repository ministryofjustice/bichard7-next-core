import { ProgressCardsAuditStatus } from "components/ProgressCardsAuditStatus"

describe("<ProgressCardsAuditStatus />", () => {
  it("renders the correct counts in the visual cards", () => {
    cy.mount(<ProgressCardsAuditStatus passCount={5} failCount={2} totalCases={10} />)

    cy.contains("5").parent().should("contain", "Passed")
    cy.contains("2").parent().should("contain", "Failed")
    cy.contains("3").parent().should("contain", "Remaining")
  })

  it('prevents a negative "Remaining" count if inputs exceed total', () => {
    cy.mount(<ProgressCardsAuditStatus passCount={10} failCount={10} totalCases={15} />)

    cy.contains("Remaining").siblings().first().should("have.text", "0")
  })

  it("calculates the screen reader summary correctly", () => {
    cy.mount(<ProgressCardsAuditStatus passCount={10} failCount={5} totalCases={20} />)

    const expectedText = "5 failed, 10 passed, 5 remaining out of 20 total audits."
    cy.get(".govuk-visually-hidden").should("have.text", expectedText)
  })
})
