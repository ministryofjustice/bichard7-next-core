describe("All triggers excluded at user level", () => {
  beforeEach(() => {
    cy.loginAs("userWithAllTriggersExcluded")
    cy.visit("/bichard")
  })

  it("doesn't display any triggers in the main trigger groups", () => {
    cy.get("fieldset").contains("Trigger groups")
    cy.get("input#bails").should("not.exist")
    cy.get("input#custody").should("not.exist")
    cy.get("input#orders").should("not.exist")
    cy.get("input#warrants").should("not.exist")

    cy.get("fieldset").contains("Excluded").should('have.attr', 'aria-expanded', 'false')
    cy.get("fieldset").contains("Excluded").click()

    cy.get("input#excluded-bails").should("exist")
    cy.get("input#excluded-custody").should("exist")
    cy.get("input#excluded-orders").should("exist")
    cy.get("input#excluded-warrants").should("exist")
  })
})
