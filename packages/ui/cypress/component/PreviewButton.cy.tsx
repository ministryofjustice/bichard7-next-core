import PreviewButton from "../../src/components/PreviewButton"

describe("PreviewButton", () => {
  it("shows the preview button with a down pointing chevron when hidden", () => {
    cy.mount(<PreviewButton previewLabel="Preview" onClick={() => {}} showPreview={true} />)
    cy.get(".govuk-accordion-nav__chevron--down").should("exist")
    cy.get(".govuk-accordion-nav__chevron").should("exist")
    cy.get(".govuk-accordion__show-all-text").should("have.text", "Preview")
  })

  it("shows the preview button with an up pointing chevron when expanded", () => {
    cy.mount(<PreviewButton previewLabel="Preview" onClick={() => {}} showPreview={false} />)
    cy.get(".govuk-accordion-nav__chevron").should("exist")
    cy.get(".govuk-accordion__show-all-text").should("have.text", "Hide")
  })
})
