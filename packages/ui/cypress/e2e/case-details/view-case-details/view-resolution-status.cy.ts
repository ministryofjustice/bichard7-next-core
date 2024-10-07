describe("View resolution status", () => {
  beforeEach(() => {
    cy.task("clearCourtCases")
    cy.loginAs("GeneralHandler")
  })
  ;[
    {
      expectedResolutionStatus: "Unresolved",
      errorStatus: "Unresolved",
      triggerStatus: "Unresolved"
    },
    {
      expectedResolutionStatus: "Submitted",
      errorStatus: "Submitted",
      triggerStatus: "Unresolved"
    },
    {
      expectedResolutionStatus: "Resolved",
      errorStatus: "Resolved",
      triggerStatus: "Resolved"
    }
  ].forEach(({ expectedResolutionStatus, errorStatus, triggerStatus }) => {
    it(`Should correctly display ${expectedResolutionStatus} status`, () => {
      const errorResolved = errorStatus === "Resolved"
      const triggerResolved = triggerStatus === "Resolved"
      cy.task("insertCourtCasesWithFields", [
        {
          orgForPoliceFilter: "01",
          errorCount: errorStatus ? 1 : 0,
          errorStatus: errorStatus,
          triggerCount: triggerStatus ? 1 : 0,
          triggerStatus: triggerStatus,
          errorResolvedTimestamp: errorResolved ? new Date() : null,
          triggerResolvedTimestamp: triggerResolved ? new Date() : null,
          errorResolvedBy: errorResolved ? "GeneralHandler" : null,
          triggerResolvedBy: triggerResolved ? "GeneralHandler" : null,
          resolutionTimestamp: errorResolved && triggerResolved ? new Date() : null
        }
      ])

      cy.visit("/bichard")

      if (expectedResolutionStatus === "Unresolved") {
        cy.get(`.moj-badge`).should("not.exist")
        cy.visit("/bichard/court-cases/0")
        cy.get(`.moj-badge`).should("not.exist")

        return
      }

      if (expectedResolutionStatus === "Resolved") {
        cy.get(`label[for="resolved"]`).click()
        cy.get("button[id=search]").click()
      }

      cy.get(`.moj-badge-${expectedResolutionStatus.toLowerCase()}`)
        .contains(expectedResolutionStatus)
        .should("exist")
        .should("be.visible")
      cy.visit("/bichard/court-cases/0")
      cy.get(`.moj-badge-${expectedResolutionStatus.toLowerCase()}`)
        .contains(expectedResolutionStatus)
        .should("exist")
        .should("be.visible")
    })
  })
})
