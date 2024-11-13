describe("Triggers excluded at user level", () => {
  beforeEach(() => {
    cy.loginAs("SupervisorWithExcludedTriggers")
    cy.visit("/bichard")
  })

  it("should not show excluded triggers in trigger groups and reason codes in the reason codes input when we click on Bails", () => {
    cy.get("input#bails").should("exist")
    cy.get("input#bails").click()

    cy.get(".govuk-checkboxes__item #trpr0008 + label").should("not.exist")
    cy.get(".govuk-checkboxes__item #trpr0010 + label").contains("PR10 - Conditional bail").should("exist")
    cy.get(".govuk-checkboxes__item #trpr0020 + label").contains("PR20 - Breach").should("exist")
    cy.get(".govuk-checkboxes__item #trpr0030 + label").contains("PR30 - Pre-charge bail application").should("exist")

    cy.get("input#reasonCodes").should("value", "PR10 PR20 PR30")
  })

  it("should not show excluded triggers in trigger groups and reason codes in the reason codes input when we click on custody", () => {
    cy.get("input#custody").should("exist")
    cy.get("input#custody").click()

    cy.get(".govuk-checkboxes__item #trpr0001 + label").should("not.exist")
    cy.get(".govuk-checkboxes__item #trpr0005 + label").contains("PR05 - Remand in custody").should("exist")
    cy.get(".govuk-checkboxes__item #trpr0006 + label").contains("PR06 - Imprisoned").should("exist")
    cy.get(".govuk-checkboxes__item #trpr0019 + label").contains("PR19 - Bail direction").should("exist")
    cy.get(".govuk-checkboxes__item #trpr0021 + label").contains("PR21 - Disq. non-motoring").should("exist")

    cy.get("input#reasonCodes").should("value", "PR05 PR06 PR19 PR21")
  })

  it("should not show excluded triggers in trigger groups and reason codes in the reason codes input when we click on Orders", () => {
    cy.get("input#orders").should("exist")
    cy.get("input#orders").click()

    cy.get(".govuk-checkboxes__item #trpr0003 + label").should("not.exist")
    cy.get(".govuk-checkboxes__item #trpr0016 + label").contains("PR16 - Forfeiture order").should("exist")
    cy.get(".govuk-checkboxes__item #trpr0025 + label").contains("PR25 - Case reopened").should("exist")
    cy.get(".govuk-checkboxes__item #trpr0026 + label").contains("PR26 - Disq. Suspended").should("exist")
    cy.get(".govuk-checkboxes__item #trpr0029 + label").contains("PR29 - Civil Proceedings").should("exist")
    cy.get(".govuk-checkboxes__item #trps0008 + label").contains("PS08 - Curfew order").should("exist")

    cy.get("input#reasonCodes").should("value", "PR16 PR25 PR26 PR29 PS08")
  })

  it("should not show excluded triggers in trigger groups and reason codes in the reason codes input when we click on Warrants", () => {
    cy.get("input#warrants").should("exist")
    cy.get("input#warrants").click()

    cy.get(".govuk-checkboxes__item #trpr0002 + label").should("not.exist")
    cy.get(".govuk-checkboxes__item #trpr0012 + label").contains("PR12 - Warrant withdrawn").should("exist")

    cy.get("input#reasonCodes").should("value", "PR12")
  })
})
