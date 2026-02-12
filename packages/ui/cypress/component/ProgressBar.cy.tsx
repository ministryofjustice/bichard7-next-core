import { ProgressBar } from "components/ProgressBar"

describe("<ProgressBar />", () => {
  it("does not render when currentCount is 0 or less", () => {
    cy.mount(<ProgressBar currentCount={0} maxCount={10} labelType="percentage" />)
    cy.get("section").should("not.exist")

    cy.mount(<ProgressBar currentCount={-5} maxCount={10} labelType="percentage" />)
    cy.get("section").should("not.exist")
  })

  it("renders the page count label type", () => {
    cy.mount(<ProgressBar currentCount={3} maxCount={10} labelType="pageCount" />)
    cy.contains("Page 3 of 10").should("be.visible")
  })

  it("renders the percentage label", () => {
    cy.mount(<ProgressBar currentCount={25} maxCount={100} labelType="percentage" />)

    cy.contains("Progress: 25%").should("be.visible")
  })

  it("clamps the visual width to 100%", () => {
    cy.mount(<ProgressBar currentCount={15} maxCount={10} labelType="percentage" />)

    cy.contains("Progress: 100%").should("be.visible")
  })

  it("has the correct ARIA attributes", () => {
    cy.mount(<ProgressBar currentCount={50} maxCount={100} labelType="percentage" />)

    cy.get(".govuk-visually-hidden").should("have.text", "Progress Bar Label: ")

    cy.get('[role="progressbar"]')
      .should("have.attr", "aria-valuenow", "50")
      .and("have.attr", "aria-valuemin", "0")
      .and("have.attr", "aria-valuemax", "100")
  })
})
