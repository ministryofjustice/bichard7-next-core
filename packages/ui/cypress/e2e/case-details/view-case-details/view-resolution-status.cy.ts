describe("View resolution status", () => {
  beforeEach(() => {
    cy.task("clearCourtCases")
    cy.loginAs("GeneralHandler")
  })
  ;[
    {
      errorStatus: "Unresolved",
      expectedResolutionStatus: "Unresolved",
      triggerStatus: "Unresolved"
    },
    {
      errorStatus: "Submitted",
      expectedResolutionStatus: "Submitted",
      triggerStatus: "Unresolved"
    },
    {
      errorStatus: "Resolved",
      expectedResolutionStatus: "Resolved",
      triggerStatus: "Resolved"
    }
  ].forEach(({ errorStatus, expectedResolutionStatus, triggerStatus }) => {
    it(`Should correctly display ${expectedResolutionStatus} status`, () => {
      const errorResolved = errorStatus === "Resolved"
      const triggerResolved = triggerStatus === "Resolved"
      cy.task("insertCourtCasesWithFields", [
        {
          errorCount: errorStatus ? 1 : 0,
          errorResolvedBy: errorResolved ? "GeneralHandler" : null,
          errorResolvedTimestamp: errorResolved ? new Date() : null,
          errorStatus: errorStatus,
          orgForPoliceFilter: "01",
          resolutionTimestamp: errorResolved && triggerResolved ? new Date() : null,
          triggerCount: triggerStatus ? 1 : 0,
          triggerResolvedBy: triggerResolved ? "GeneralHandler" : null,
          triggerResolvedTimestamp: triggerResolved ? new Date() : null,
          triggerStatus: triggerStatus
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