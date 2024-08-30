import a11yConfig from "../../support/a11yConfig"
import { confirmFiltersAppliedContains, loginAndVisit } from "../../support/helpers"
import logAccessibilityViolations from "../../support/logAccessibilityViolations"

describe("Pagination", () => {
  beforeEach(() => {
    cy.task("clearCourtCases")
  })

  it("Should be accessible", () => {
    cy.task("insertMultipleDummyCourtCases", { numToInsert: 100, force: "01" })

    loginAndVisit()

    cy.injectAxe()

    // Wait for the page to fully load
    cy.get("h1")

    cy.checkA11y(undefined, a11yConfig, logAccessibilityViolations)
  })

  it("lets users select how many cases to show per page", () => {
    cy.task("insertMultipleDummyCourtCases", { numToInsert: 200, force: "01" })

    loginAndVisit()

    cy.get("tbody tr").should("have.length", 50)
    cy.get("tr").contains("Case00000").should("exist")
    cy.get("tr").contains("Case00024").should("exist")

    cy.get(".cases-per-page").first().select("25")
    cy.get("tbody tr").should("have.length", 25)

    cy.get(".cases-per-page").first().select("100")
    cy.get("tbody tr").should("have.length", 100)

    cy.get(".cases-per-page").first().select("200")
    cy.get("tbody tr").should("have.length", 200)

    cy.get(".cases-per-page").first().select("25")
    // Navigating to a different page should keep the same page size
    cy.get(".moj-pagination__item").contains("Next").first().click()
    cy.get("tbody tr").should("have.length", 25)
    cy.get("tr").contains("Case00025").should("exist")
    cy.get("tr").contains("Case00049").should("exist")

    cy.get(".cases-per-page").first().select("25")
    cy.get("tbody tr").should("have.length", 25)
  })

  it("keeps roughly the same position in the case list when changing page size", () => {
    cy.task("insertMultipleDummyCourtCases", { numToInsert: 100, force: "01" })

    loginAndVisit()

    cy.get(".cases-per-page").first().select("50")
    cy.get("tbody tr").should("have.length", 50)

    cy.get(".moj-pagination__item").contains("Next").first().click()
    cy.get("tbody tr").should("have.length", 50)
    cy.get("tr").contains("Case00050").should("exist")

    cy.get(".cases-per-page").first().select("25")
    cy.get("tbody tr").should("have.length", 25)
    cy.get("tr").contains("Case00050").should("exist")
  })

  it("Should redirect to last page if the requested page is greater than the last possible page", () => {
    cy.task("insertCourtCasesWithFields", [
      { orgForPoliceFilter: "011111" },
      { orgForPoliceFilter: "011111" },
      { orgForPoliceFilter: "011111" },
      { orgForPoliceFilter: "011111" },
      { orgForPoliceFilter: "011111" },
      { orgForPoliceFilter: "011111" },
      { orgForPoliceFilter: "011111" }
    ])
    loginAndVisit("/bichard?page=5")
    cy.url().should("match", /\/bichard\?page=1/)
  })

  it("doesn't show navigation options when there is only one page", () => {
    cy.task("insertMultipleDummyCourtCases", { numToInsert: 3, force: "01" })

    loginAndVisit()

    cy.get(".moj-pagination__list li").should("not.exist")
  })

  it("has correct pagination information when there is only one page", () => {
    cy.task("insertMultipleDummyCourtCases", { numToInsert: 3, force: "01" })

    loginAndVisit()

    cy.get("p.moj-pagination__results").should("contain.text", "Showing 1 to 3 of 3 cases")
  })

  it("lets users navigate back and forth between pages using the page numbers", () => {
    cy.task("insertMultipleDummyCourtCases", { numToInsert: 250, force: "01" })

    loginAndVisit()

    cy.get(".cases-per-page").first().select("25")

    cy.get("p.moj-pagination__results").first().should("contain.text", "Showing 1 to 25 of 250 cases")
    cy.get("tr").contains("Case00000").should("exist")
    cy.get("tr").contains("Case00024").should("exist")

    cy.get("li.moj-pagination__item").contains("2").click()
    cy.get("p.moj-pagination__results").first().should("contain.text", "Showing 26 to 50 of 250 cases")
    cy.get("tr").contains("Case00025").should("exist")
    cy.get("tr").contains("Case00049").should("exist")

    cy.get("li.moj-pagination__item").contains("10").click()
    cy.get("p.moj-pagination__results").first().should("contain.text", "Showing 226 to 250 of 250 cases")
    cy.get("tr").contains("Case00225").should("exist")
    cy.get("tr").contains("Case00249").should("exist")

    cy.get("li.moj-pagination__item").contains("9").click()
    cy.get("p.moj-pagination__results").first().should("contain.text", "Showing 201 to 225 of 250 cases")
    cy.get("tr").contains("Case00200").should("exist")
    cy.get("tr").contains("Case00224").should("exist")
  })

  it("lets users navigate back and forth between pages using the next and previous arrows", () => {
    cy.task("insertMultipleDummyCourtCases", { numToInsert: 250, force: "01" })

    loginAndVisit()

    cy.get(".cases-per-page").first().select("25")

    cy.get("p.moj-pagination__results").first().should("contain.text", "Showing 1 to 25 of 250 cases")
    cy.get("tr").contains("Case00000").should("exist")
    cy.get("tr").contains("Case00024").should("exist")

    cy.get("li.moj-pagination__item").contains("Next").click()
    cy.get("p.moj-pagination__results").first().should("contain.text", "Showing 26 to 50 of 250 cases")
    cy.get("tr").contains("Case00025").should("exist")
    cy.get("tr").contains("Case00049").should("exist")

    cy.get("li.moj-pagination__item").contains("Next").click()
    cy.get("p.moj-pagination__results").first().should("contain.text", "Showing 51 to 75 of 250 cases")
    cy.get("tr").contains("Case00050").should("exist")
    cy.get("tr").contains("Case00074").should("exist")

    cy.get("li.moj-pagination__item").contains("Previous").click()
    cy.get("p.moj-pagination__results").first().should("contain.text", "Showing 26 to 50 of 250 cases")
    cy.get("tr").contains("Case00025").should("exist")
    cy.get("tr").contains("Case00049").should("exist")
  })

  it("has correct pagination information on page 3 out of 5", () => {
    cy.task("insertMultipleDummyCourtCases", { numToInsert: 250, force: "01" })

    loginAndVisit("/bichard?page=3")

    cy.get("p.moj-pagination__results").first().should("contain.text", "Showing 101 to 150 of 250 cases")
    cy.get("tr").contains("Case00100").should("exist")
    cy.get("tr").contains("Case00124").should("exist")
  })

  it("keeps other filters applied when changing pages", () => {
    cy.task("insertMultipleDummyCourtCases", {
      numToInsert: 100,
      force: "01",
      otherFields: {
        errorLockedByUsername: "GeneralHandler",
        triggerLockedByUsername: "GeneralHandler"
      }
    })

    loginAndVisit()

    cy.get("label[for='locked-state-lockedtome']").click()
    cy.get("#search").click()

    confirmFiltersAppliedContains("Locked to me")

    cy.get("li.moj-pagination__item").contains("Next").click()
    confirmFiltersAppliedContains("Locked to me")
  })
})
