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

  it("should show an error if rating is not selected", () => {
    cy.visit("/feedback")
    cy.get('textarea[name="feedback"]').type("This is a test.")
    cy.get("form").submit()
    cy.url().should("not.include", "/confirmation")
    cy.contains("There is a problem").should("be.visible")
    cy.contains("Select how you feel about using Bichard7").should("be.visible")
  })

  it("should show an error if feedback is empty", () => {
    cy.visit("/feedback")
    cy.get('input[name="rating"][value="satisfied"]').check()
    cy.get("form").submit()
    cy.url().should("not.include", "/confirmation")
    cy.contains("There is a problem").should("be.visible")
    cy.contains("Provide feedback").should("be.visible")
  })

  it("should show an error if feedback is over the character limit", () => {
    cy.visit("/feedback")
    cy.get('input[name="rating"][value="satisfied"]').check()
    const longFeedback = "a".repeat(801)
    cy.get('textarea[name="feedback"]').type(longFeedback, { delay: 0 })
    cy.get("form").submit()
    cy.url().should("not.include", "/confirmation")
    cy.contains("There is a problem").should("be.visible")
    cy.contains("You can enter up to 800 characters").should("be.visible")
  })

  it("should show multiple errors if rating is not selected and feedback is empty", () => {
    cy.visit("/feedback")
    cy.get("form").submit()
    cy.url().should("not.include", "/confirmation")
    cy.contains("There is a problem").should("be.visible")
    cy.contains("Select how you feel about using Bichard7").should("be.visible")
    cy.contains("Provide feedback").should("be.visible")
  })

  it("should show multiple errors if rating is not selected and feedback is over the character limit", () => {
    cy.visit("/feedback")
    const longFeedback = "a".repeat(801)
    cy.get('textarea[name="feedback"]').type(longFeedback, { delay: 0 })
    cy.get("form").submit()
    cy.url().should("not.include", "/confirmation")
    cy.contains("There is a problem").should("be.visible")
    cy.contains("Select how you feel about using Bichard7").should("be.visible")
    cy.contains("You can enter up to 800 characters").should("be.visible")
  })
})
