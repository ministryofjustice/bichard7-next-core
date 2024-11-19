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
        { orgForPoliceFilter: force, resolutionTimestamp: null },
        {
          errorResolvedBy: "GeneralHandler",
          errorResolvedTimestamp: resolutionTimestamp,
          errorStatus: "Resolved",
          orgForPoliceFilter: force,
          resolutionTimestamp
        },
        {
          errorResolvedBy: "Supervisor",
          errorResolvedTimestamp: resolutionTimestamp,
          errorStatus: "Resolved",
          orgForPoliceFilter: force,
          resolutionTimestamp
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

      // Removing case state filter tag unresolved cases should be shown with the filter disabled
      cy.get(".moj-filter__tag").contains("My resolved cases").click()
      cy.get("button[id=search]").click()
      cy.get(".moj-scrollable-pane tbody tr").should("have.length", 2)
      cy.contains("Case00001")
      cy.contains("Case00002")

      // Removing case state filter tag unresolved cases should be shown with the filter disabled
      cy.get(".moj-filter__tag").contains("Resolved").click()
      cy.get("button[id=search]").click()
      cy.get(".moj-scrollable-pane tbody tr").should("have.length", 1)
      cy.contains("Case00000")
    })

    it("Should automatically check 'Resolved', if 'My resolved cases' is checked", () => {
      visitBasePath()

      // Filter for "My resolved cases"
      cy.get(`label[for="myResolvedCases"]`).click()
      cy.get("#resolved").should("be.checked")
      cy.get("#myResolvedCases").should("be.checked")

      // Remove "Resolved" filter
      cy.get(`label[for="resolved"]`).click()
      cy.get("#resolved").should("not.be.checked")
      cy.get("#myResolvedCases").should("not.be.checked")

      // Reapply "Resolved" filter
      cy.get(`label[for="resolved"]`).click()
      cy.get("#resolved").should("be.checked")
      cy.get("#myResolvedCases").should("not.be.checked")

      // Reapply "My resolved cases"
      cy.get(`label[for="myResolvedCases"]`).click()
      cy.get("#myResolvedCases").should("be.checked")

      // Remove "My resolved cases"
      cy.get(`label[for="myResolvedCases"]`).click()
      cy.get("#resolved").should("be.checked")
      cy.get("#myResolvedCases").should("not.be.checked")
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