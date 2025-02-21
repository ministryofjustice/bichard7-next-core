describe("All triggers excluded at user level", () => {
  beforeEach(() => {
    cy.loginAs("userWithJustWarrantsTriggersIncluded")
    cy.visit("/bichard")
  })

  it("just displays warrant triggers", () => {
    cy.get("input#bails").should("not.exist")
    cy.get("input#custody").should("not.exist")
    cy.get("input#orders").should("not.exist")

    cy.get("input#warrants").should("exist")
    cy.get("input#warrants").click()

    cy.get(".govuk-checkboxes__item #trpr0002 + label").contains("PR02 - Warrant issued").should("exist")
    cy.get(".govuk-checkboxes__item #trpr0012 + label").contains("PR12 - Warrant withdrawn").should("exist")
  })
})
