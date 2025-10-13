describe("FAQ", () => {
  it("should display the FAQ title", () => {
    cy.visit("/faq")

    cy.get("[data-test='faq_heading']").should("have.text", "Frequently Asked Questions")
  })

  it("should display the expected 6 questions and answers", () => {
    cy.visit("/faq")

    cy.get("[data-test='faq-item']").should("have.length", "6")
  })
})
