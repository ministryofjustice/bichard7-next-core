import { visitBasePath } from "../../../support/helpers"

describe("Filtering cases by case state", () => {
  beforeEach(() => {
    cy.task("clearCourtCases")
    cy.task("clearTriggers")
  })

  describe("with ListAllCases permission", () => {
    beforeEach(() => {
      cy.loginAs("Supervisor")
    })

    it("Should filter cases by case state", () => {
      const resolutionTimestamp = new Date()
      const force = "011111"
      cy.task("insertCourtCasesWithFields", [
        { resolutionTimestamp: null, orgForPoliceFilter: force },
        {
          resolutionTimestamp,
          errorResolvedTimestamp: resolutionTimestamp,
          orgForPoliceFilter: force,
          errorResolvedBy: "GeneralHandler",
          errorStatus: "Resolved"
        },
        {
          resolutionTimestamp,
          errorResolvedTimestamp: resolutionTimestamp,
          orgForPoliceFilter: force,
          errorResolvedBy: "Supervisor",
          errorStatus: "Resolved"
        }
      ])

      visitBasePath()

      // Filter for unresolved cases by default
      cy.get(".moj-scrollable-pane tbody tr").should("have.length", 1)
      cy.contains("Case00000")

      // Filter for resolved cases
      cy.get(`label[for="resolved"]`).click()
      cy.get("button[id=search]").click()

      cy.get(".moj-scrollable-pane tbody tr").should("have.length", 2)
      cy.contains("Case00001")
      cy.contains("Case00002")

      // Filter for "My resolved cases"
      cy.get(`label[for="myResolvedCases"]`).click()
      cy.get("button[id=search]").click()

      cy.get(".moj-scrollable-pane tbody tr").should("have.length", 1)
      cy.contains("Case00002")

      // Switch back to unresolved cases
      cy.get(`label[for="unresolved"]`).click()
      cy.get("button[id=search]").click()
      cy.get(".moj-scrollable-pane tbody tr").should("have.length", 1)
      cy.contains("Case00000")

    })
  })

  describe("without ListAllCases permission", () => {
    beforeEach(() => {
      cy.loginAs("GeneralHandler")
    })
    it("Should not show the 'My resolved cases' check box if the user is not in the supervisor group", () => {
      visitBasePath()
      cy.get('label[for="myResolvedCases"]').should("not.exist")
    })
  })
})

export {}
