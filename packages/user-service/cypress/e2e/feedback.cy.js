describe("Feedback", () => {
  it("should display text area", () => {
    cy.visit("/feedback")
    cy.get("textarea[name='feedback']").should("exist")
  })

  it("should display rating options", () => {
    cy.visit("/feedback")
    cy.get('input[name="rating"]').should("have.length", 5)
  })
})

describe("Form submission", () => {
  it("should submit form and redirect to confirmation page", () => {
    cy.visit("/feedback")
    cy.get('input[name="rating"][value="satisfied"]').check()
    cy.get('textarea[name="feedback"]').type("This is a test.")
    cy.get("form").submit()
    cy.url().should("include", "/confirmation")
  })
})
