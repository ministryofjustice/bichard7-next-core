import { loginAndVisit } from "../../../support/helpers"

describe("Case list", () => {
  context("search panel", () => {
    it("Should correctly show chips when the panel is hidden and visible", () => {
      loginAndVisit()

      // Check that no chips exist on load
      cy.get("#filter-button").contains("Hide search panel").should("exist")
      cy.get(".moj-filter").contains("Applied filters").should("not.exist")

      // Hide the search panel
      cy.get("#filter-button").contains("Hide search panel").click()

      // Check that no chips exist still
      cy.get(".moj-action-bar ul.moj-filter-tags").should("not.exist")

      // Show the search panel
      cy.get("#filter-button").contains("Show search panel").click()

      // Enter a search
      cy.get(".govuk-radios__label").contains("Exceptions").click()
      cy.get("button[id=search]").click()

      // Make sure the chips exist
      cy.get(".moj-filter").contains("Applied filters").should("exist")

      // Hide the search panel
      cy.get("#filter-button").contains("Hide search panel").click()

      // Make sure the chips are displayed
      cy.get(".moj-action-bar ul.moj-filter-tags").should("exist")
    })
  })
})
