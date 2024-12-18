describe("Triggers excluded at force level", () => {
  beforeEach(() => {
    cy.loginAs("GeneralHandler")
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

    cy.get(".govuk-checkboxes__item #trpr0001 + label").contains("PR01 - Disqualified driver").should("exist")
    cy.get(".govuk-checkboxes__item #trpr0005 + label").should("not.exist")
    cy.get(".govuk-checkboxes__item #trpr0006 + label").should("not.exist")
    cy.get(".govuk-checkboxes__item #trpr0019 + label").contains("PR19 - Bail direction").should("exist")
    cy.get(".govuk-checkboxes__item #trpr0021 + label").should("not.exist")

    cy.get("input#reasonCodes").should("value", "PR01 PR19")
  })

  it("should not show excluded triggers in trigger groups and reason codes in the reason codes input when we click on Orders", () => {
    cy.get("input#orders").should("exist")
    cy.get("input#orders").click()

    cy.get(".govuk-checkboxes__item #trpr0003 + label").should("not.exist")
    cy.get(".govuk-checkboxes__item #trpr0016 + label").should("not.exist")
    cy.get(".govuk-checkboxes__item #trpr0025 + label").should("not.exist")
    cy.get(".govuk-checkboxes__item #trpr0026 + label").contains("PR26 - Disq. Suspended").should("exist")
    cy.get(".govuk-checkboxes__item #trpr0029 + label").contains("PR29 - Civil Proceedings").should("exist")
    cy.get(".govuk-checkboxes__item #trps0008 + label").should("not.exist")

    cy.get("input#reasonCodes").should("value", "PR26 PR29")
  })

  it("should not show excluded triggers in trigger groups and reason codes in the reason codes input when we click on Warrants", () => {
    cy.get("input#warrants").should("exist")
    cy.get("input#warrants").click()

    cy.get(".govuk-checkboxes__item #trpr0002 + label").contains("PR02 - Warrant issued").should("exist")
    cy.get(".govuk-checkboxes__item #trpr0012 + label").contains("PR12 - Warrant withdrawn").should("exist")

    cy.get("input#reasonCodes").should("value", "PR02 PR12")
  })
})
