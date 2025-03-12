describe("All triggers excluded at user level", () => {
  beforeEach(() => {
    cy.loginAs("userWithAllTriggersExcluded")
    cy.visit("/bichard")
  })

  it("doesn't display any triggers", () => {
    cy.get("input#bails").should("not.exist")
    cy.get("input#custody").should("not.exist")
    cy.get("input#orders").should("not.exist")
    cy.get("input#warrants").should("not.exist")

    cy.get("fieldset").contains("Trigger groups")
    cy.get(".trigger-groups-fieldset .govuk-body").should("have.text", "No trigger groups")
  })
})
