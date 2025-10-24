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
