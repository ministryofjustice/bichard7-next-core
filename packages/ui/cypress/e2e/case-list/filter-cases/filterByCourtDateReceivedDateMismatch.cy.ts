describe("Filtering cases by court date received date mismatch", () => {
  beforeEach(() => {
    cy.task("clearCourtCases")
    cy.task("clearTriggers")
    cy.loginAs("GeneralHandler")
  })

  it("Should update 'selected filter' chip when changing court date received date mismatch filter", () => {
    cy.visit("/bichard")

    cy.get("#court-date-received-date-mismatch").click()
    cy.get(".moj-filter__tag").contains("Include cases where date received is different")
    cy.get("#court-date-received-date-mismatch").should("be.checked")
  })

  it("Should update 'applied filter' chip when changing court date received date mismatch filter", () => {
    cy.visit("/bichard")

    cy.get("#court-date-received-date-mismatch").click()
    cy.get(".moj-filter__tag").contains("Include cases where date received is different")
    cy.get("#search").click()
    cy.get("#court-date-received-date-mismatch").should("be.checked")
    cy.get(".govuk-heading-m").contains("Applied filters")
    cy.get(".moj-filter__tag").contains("Include cases where date received is different")
  })
})

export {}
