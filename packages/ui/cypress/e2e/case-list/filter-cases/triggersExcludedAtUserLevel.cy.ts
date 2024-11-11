describe("Triggers excluded at user level", () => {
    it("should not show excluded triggers in trigger groups and reason codes in the reason codes input when we click on Bails", () => {
      cy.loginAs("SupervisorWithExcludedTriggers")
      cy.visit("/bichard")

      cy.get("input#bails").should("exist")
      cy.get("input#bails").click()

      cy.get(".govuk-checkboxes__item").contains("PR08 - Breach of bail").should("not.exist")
      cy.get(".govuk-checkboxes__item").contains("PR10 - Conditional bail").should("exist")
      cy.get(".govuk-checkboxes__item").contains("PR20 - Breach").should("exist")
      cy.get(".govuk-checkboxes__item").contains("PR30 - Pre-charge bail application").should("exist")

      cy.get("input#reasonCodes").should("value", "PR10 PR20 PR30")
    })

    it("should not show excluded triggers in trigger groups and reason codes in the reason codes input when we click on custody", () => {
      cy.loginAs("SupervisorWithExcludedTriggers")
      cy.visit("/bichard")

      cy.get("input#custody").should("exist")
      cy.get("input#custody").click()

      cy.get(".govuk-checkboxes__item").contains("PR01 - Disqualified driver").should("not.exist")
      cy.get(".govuk-checkboxes__item").contains("PR05 - Remand in custody").should("exist")
      cy.get(".govuk-checkboxes__item").contains("PR06 - Imprisoned").should("exist")
      cy.get(".govuk-checkboxes__item").contains("PR19 - Bail direction").should("exist")
      cy.get(".govuk-checkboxes__item").contains("PR21 - Disq. non-motoring").should("exist")

      cy.get("input#reasonCodes").should("value", "PR05 PR06 PR19 PR21")
    })

    it("should not show excluded triggers in trigger groups and reason codes in the reason codes input when we click on Orders", () => {
      cy.loginAs("SupervisorWithExcludedTriggers")
      cy.visit("/bichard")

      cy.get("input#orders").should("exist")
      cy.get("input#orders").click()

      cy.get(".govuk-checkboxes__item").contains("PR03 - Order issues").should("not.exist")
      cy.get(".govuk-checkboxes__item").contains("PR16 - Forfeiture order").should("exist")
      cy.get(".govuk-checkboxes__item").contains("PR25 - Case reopened").should("exist")
      cy.get(".govuk-checkboxes__item").contains("PR26 - Disq. Suspended").should("exist")
      cy.get(".govuk-checkboxes__item").contains("PR29 - Civil Proceedings").should("exist")
      cy.get(".govuk-checkboxes__item").contains("PS08 - Curfew order").should("exist")

      cy.get("input#reasonCodes").should("value", "PR16 PR25 PR26 PR29 PS08")
    })

    it("should not show excluded triggers in trigger groups and reason codes in the reason codes input when we click on Warrants", () => {
      cy.loginAs("SupervisorWithExcludedTriggers")
      cy.visit("/bichard")

      cy.get("input#warrants").should("exist")
      cy.get("input#warrants").click()

      cy.get(".govuk-checkboxes__item").contains("PR02 - Warrant issued").should("not.exist")
      cy.get(".govuk-checkboxes__item").contains("PR12 - Warrant withdrawn").should("exist")

      cy.get("input#reasonCodes").should("value", "PR12")
    })
  })