import { collapseFilterSection, confirmFiltersAppliedContains, removeFilterTagWhilstSearchPanelIsHidden } from "../../../support/helpers"

describe("Filtering cases by resolved date", () => {
  beforeEach(() => {
    cy.task("clearCourtCases")
    cy.task("clearTriggers")
    cy.loginAs("GeneralHandler")
  })

  it("Should expand and collapse Case resolved date filter navigation", () => {
    cy.visit("/bichard")

    cy.contains("Case resolved")

    cy.get(`label[for="date-resolvedFrom"]`).should("be.visible")
    cy.get(`label[for="date-resolvedTo"]`).should("be.visible")

    collapseFilterSection(".filters-case-resolved-date", "#date-resolvedFrom")
    cy.get(`label[for="date-resolvedTo"]`).should("not.exist")
  })

  it("Should display cases filtered for a resolution date range", () => {
    const force = "011111"

    cy.task("insertCourtCasesWithFields", [
      { errorResolvedBy: "GeneralHandler", errorStatus: "Resolved", resolutionTimestamp: new Date("2023-01-1"), orgForPoliceFilter: force },
      { errorResolvedBy: "GeneralHandler", errorStatus: "Resolved", resolutionTimestamp: new Date("2023-02-1"), orgForPoliceFilter: force },
      { errorResolvedBy: "GeneralHandler", errorStatus: "Resolved", resolutionTimestamp: new Date("2022-12-1"), orgForPoliceFilter: force },
      { errorResolvedBy: "GeneralHandler", errorStatus: "Resolved", resolutionTimestamp: new Date("2022-11-15"), orgForPoliceFilter: force },
      { errorResolvedBy: "GeneralHandler", errorStatus: "Resolved", resolutionTimestamp: new Date("2022-11-2"), orgForPoliceFilter: force },
      { errorResolvedBy: "GeneralHandler", errorStatus: "Resolved", resolutionTimestamp: new Date("2022-10-30"), orgForPoliceFilter: force },
      { errorResolvedBy: "GeneralHandler", errorStatus: "Resolved", resolutionTimestamp: new Date("2022-10-15"), orgForPoliceFilter: force },
      { errorResolvedBy: "GeneralHandler", errorStatus: "Resolved", resolutionTimestamp: new Date("2022-10-1"), orgForPoliceFilter: force },
      { errorResolvedBy: "GeneralHandler", errorStatus: "Resolved", resolutionTimestamp: new Date("2022-09-15"), orgForPoliceFilter: force },
      { errorResolvedBy: "GeneralHandler", errorStatus: "Resolved", resolutionTimestamp: new Date("2021-12-15"), orgForPoliceFilter: force },
      { errorResolvedBy: "GeneralHandler", errorStatus: "Resolved", resolutionTimestamp: new Date("2021-02-10"), orgForPoliceFilter: force },
      { errorResolvedBy: "GeneralHandler", errorStatus: "Resolved", resolutionTimestamp: new Date("2020-05-30"), orgForPoliceFilter: force },
      { errorResolvedBy: "GeneralHandler", errorStatus: "Resolved", resolutionTimestamp: new Date("2019-05-10"), orgForPoliceFilter: force }
    ])

    cy.visit("/bichard")

    cy.get(`label[for="resolved"]`).click()
    cy.get(`label[for="date-resolvedFrom"]`).type("2022-01-01")
    cy.get(`label[for="date-resolvedTo"]`).type("2022-12-31")
    cy.get(".govuk-heading-s").contains("Case resolved date range").should("exist")
    cy.get(".moj-filter__tag").contains("01/01/2022 - 31/12/2022")
    cy.get("button#search").click()

    cy.get("#date-resolvedFrom").should("have.value", "2022-01-01")
    cy.get("#date-resolvedTo").should("have.value", "2022-12-31")

    cy.get(".moj-scrollable-pane tbody tr").should("have.length", 7)

    cy.contains("Hide search panel").click()

    confirmFiltersAppliedContains("01/01/2022 - 31/12/2022")
    removeFilterTagWhilstSearchPanelIsHidden("01/01/2022 - 31/12/2022")
    cy.get(".moj-scrollable-pane tbody tr").should("have.length", 13)
  })

  it("Should update 'selected filter' chip when changing Case resolved date filter", () => {
    cy.visit("/bichard")

    cy.get(`label[for="date-resolvedFrom"]`).type("1999-01-01")
    cy.get(`label[for="date-resolvedTo"]`).type("2000-12-31")
    cy.get(".govuk-heading-s").contains("Case resolved date").should("exist")
    cy.get(".moj-filter__tag").contains("01/01/1999 - 31/12/2000")

    cy.get(`label[for="date-resolvedFrom"]`).type("2022-01-01")
    cy.get(`label[for="date-resolvedTo"]`).type("2022-12-31")
    cy.get(".moj-filter__tag").contains("01/01/2022 - 31/12/2022")
  })
})

export {}
