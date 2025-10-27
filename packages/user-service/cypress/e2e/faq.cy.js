describe("FAQ", () => {
  it("should display the FAQ title", () => {
    cy.visit("/faq")

    cy.get("[data-test='help_heading']").should("have.text", "Help")
  })

  it("should 2 subheadings", () => {
    cy.visit("/faq")

    cy.get("[data-test='help_sub_heading_1']").should("have.text", "Problems with your account")
    cy.get("[data-test='help_sub_heading_2']").should("have.text", "Report something not working")
  })
})
