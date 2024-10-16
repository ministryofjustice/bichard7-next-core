import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import { addDays, format, subDays } from "date-fns"
import { TestTrigger } from "../../../../test/utils/manageTriggers"
import a11yConfig from "../../../support/a11yConfig"
import {
  confirmFiltersAppliedContains,
  confirmMultipleFieldsDisplayed,
  confirmMultipleFieldsNotDisplayed,
  filterByCaseAge
} from "../../../support/helpers"
import logAccessibilityViolations from "../../../support/logAccessibilityViolations"

function visitBasePath() {
  cy.visit("/bichard")
}

function collapseFilterSection(sectionToBeCollapsed: string, optionToBeCollapsed: string) {
  cy.get(`button${sectionToBeCollapsed}`).click()
  cy.get(optionToBeCollapsed).should("not.exist")
}

function expandFilterSection(sectionToBeExpanded: string, optionToBeExpanded: string) {
  cy.get(`button${sectionToBeExpanded}`).click()
  cy.get(optionToBeExpanded).should("exist")
}

function removeFilterTagWhilstSearchPanelIsHidden(filterTag: string) {
  cy.get(".moj-filter-tags a.moj-filter__tag").contains(filterTag).click({ force: true })
}

function inputAndSearch(inputId: string, phrase: string) {
  cy.get(`input[id=${inputId}]`).clear()
  cy.get(`input[id=${inputId}]`).type(phrase)
  cy.get("button[id=search]").click()
}

function tableRowShouldContain(tableRow: number, ...reasonCodes: string[]) {
  reasonCodes.forEach((reasonCode) => {
    cy.get("tbody").eq(tableRow).contains(reasonCode)
  })
}

function tableRowShouldNotContain(tableRow: number, ...reasonCodes: string[]) {
  reasonCodes.forEach((reasonCode) => {
    cy.get("tbody").eq(tableRow).contains(reasonCode).should("not.exist")
  })
}

describe("Filtering cases", () => {
  beforeEach(() => {
    cy.task("clearCourtCases")
    cy.task("clearTriggers")
    cy.loginAs("GeneralHandler")
  })

  it("Should be accessible with conditional radio buttons opened", () => {
    visitBasePath()
    cy.contains("Court date").parent().parent().parent().find("button").click()
    cy.get("#case-age").should("not.exist")
    expandFilterSection(".filters-court-date", "#case-age")

    cy.injectAxe()

    // Wait for the page to fully load
    cy.get("h1")

    cy.checkA11y(undefined, a11yConfig, logAccessibilityViolations)
  })

  it("Should be accessible", () => {
    visitBasePath()
    cy.get("input[id=defendantName]").type("Dummy")
    cy.get(`label[for="triggers-reason"]`).click()
    cy.get(`label[for="exceptions-reason"]`).click()

    cy.injectAxe()

    // Wait for the page to fully load
    cy.get("h1")

    cy.checkA11y(undefined, a11yConfig, logAccessibilityViolations)

    cy.get("button[id=search]").click()

    // Wait for the page to fully load
    cy.get("h1")

    cy.injectAxe()
    cy.checkA11y(undefined, a11yConfig, logAccessibilityViolations)
  })

  it("Should expand and collapse reason filter navigation", () => {
    visitBasePath()

    cy.contains("Exceptions")

    collapseFilterSection(".filters-reason", "#exceptions-reason")
    expandFilterSection(".filters-reason", "#exceptions-reason")
  })

  it("Should expand and collapse court date filter navigation with the radio conditional sections collapsed after the second expand", () => {
    visitBasePath()

    cy.contains("Date range")

    // Opening date range collapses case age & opens date
    cy.get(`label[for="date-range"]`).click()
    cy.get(`label[for="date-from"]`).should("be.visible")
    cy.get(`label[for="case-age-yesterday"]`).should("not.be.visible")

    cy.contains("Court date").parent().parent().parent().find("button").click()
    cy.get("#case-age").should("not.exist")
    expandFilterSection(".filters-court-date", "#case-age")

    // Date range & case ages are collapsed
    collapseFilterSection(".filters-court-date", "#date-range")
    cy.get(`label[for="date-from"]`).should("not.exist")
    cy.get(`label[for="case-age-yesterday"]`).should("not.exist")
  })

  it("Should remove the selection of the case age when it's been changed to the date range", () => {
    visitBasePath()
    filterByCaseAge(`label[for="case-age-yesterday"]`)
    cy.get("#case-age-yesterday").should("be.checked")
    cy.get(`label[for="date-range"]`).click()
    cy.get(`label[for="case-age"]`).click()
    cy.get("#case-age-yesterday").should("not.be.checked")
  })

  it("Should remove the selection of the date range when it's been changed to the case age", () => {
    visitBasePath()
    cy.get("label[for=date-range]").click()
    cy.get("label[for=date-from]").type("2022-01-01")
    cy.get("label[for=date-to]").type("2022-12-31")
    cy.get("#date-range").should("be.checked")
    filterByCaseAge(`label[for="case-age-yesterday"]`)
    cy.get("#case-age").should("be.checked")
    cy.get("#case-age-yesterday").should("be.checked")
  })

  it("Should only have the checked attribute for the selected case age ratio button", () => {
    visitBasePath()
    // no selection, nothing is checked
    cy.get("#case-age").should("not.be.checked")
    cy.get("#date-range").should("not.be.checked")
    // #case-age-yesterday selected, #case-age is checked
    filterByCaseAge(`label[for="case-age-yesterday"]`)
    cy.get("#case-age").should("be.checked")
    cy.get("#date-range").should("not.be.checked")
    // #date-range, ##date-range is checked
    cy.get(`label[for="date-range"]`).click()
    cy.get("#case-age").should("not.be.checked")
    cy.get("#date-range").should("be.checked")
  })

  it("Should expand and collapse locked state filter navigation", () => {
    visitBasePath()

    cy.contains("Locked cases")

    collapseFilterSection(".filters-locked-state", "#locked-state-locked")
    expandFilterSection(".filters-locked-state", "#locked-state-locked")
  })

  it("Should display cases filtered by defendant name", () => {
    cy.task("insertCourtCasesWithFields", [
      { defendantName: "WAYNE Bruce", orgForPoliceFilter: "011111" },
      { defendantName: "GORDON Barbara", orgForPoliceFilter: "011111" },
      { defendantName: "PENNYWORTH Alfred", orgForPoliceFilter: "011111" }
    ])

    visitBasePath()

    inputAndSearch("defendantName", "WAYNE Bruce")
    cy.contains("Hide search panel").click()

    cy.contains("WAYNE Bruce")
    confirmMultipleFieldsNotDisplayed(["GORDON Barbara", "PENNYWORTH Alfred"])
    cy.get("tr").should("have.length", 2)
    confirmFiltersAppliedContains("WAYNE Bruce")

    removeFilterTagWhilstSearchPanelIsHidden("WAYNE Bruce")

    confirmMultipleFieldsDisplayed(["WAYNE Bruce", "GORDON Barbara", "PENNYWORTH Alfred"])
  })

  it("Should display cases filtered by court name", () => {
    cy.task("insertCourtCasesWithFields", [
      { courtName: "Manchester Court", orgForPoliceFilter: "011111" },
      { courtName: "London Court", orgForPoliceFilter: "011111" },
      { courtName: "Bristol Court", orgForPoliceFilter: "011111" }
    ])

    visitBasePath()

    inputAndSearch("courtName", "Manchester Court")
    cy.contains("Hide search panel").click()

    cy.contains("Manchester Court")
    confirmMultipleFieldsNotDisplayed(["London Court", "Bristol Court"])
    cy.get("tr").should("have.length", 2)
    confirmFiltersAppliedContains("Manchester Court")

    removeFilterTagWhilstSearchPanelIsHidden("Manchester Court")

    confirmMultipleFieldsDisplayed(["Manchester Court", "London Court", "Bristol Court"])
  })

  it("Should display cases filtered by PTIURN", () => {
    cy.task("insertCourtCasesWithFields", [
      { ptiurn: "Case00001", orgForPoliceFilter: "011111" },
      { ptiurn: "Case00002", orgForPoliceFilter: "011111" },
      { ptiurn: "Case00003", orgForPoliceFilter: "011111" }
    ])

    visitBasePath()

    inputAndSearch("ptiurn", "Case00001")
    cy.contains("Hide search panel").click()

    cy.contains("Case00001")
    confirmMultipleFieldsNotDisplayed(["Case00002", "Case00003"])
    cy.get("tr").should("have.length", 2)
    confirmFiltersAppliedContains("Case00001")

    removeFilterTagWhilstSearchPanelIsHidden("Case00001")

    confirmMultipleFieldsDisplayed(["Case00001", "Case00002", "Case00003"])
  })

  it("Should display cases filtered by reason code", () => {
    cy.task("insertCourtCasesWithFields", [
      { orgForPoliceFilter: "011111" },
      { orgForPoliceFilter: "011111" },
      { orgForPoliceFilter: "011111" }
    ])

    const triggers: TestTrigger[] = [
      {
        triggerId: 0,
        triggerCode: TriggerCode.TRPR0017,
        status: "Unresolved",
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      }
    ]
    cy.task("insertTriggers", { caseId: 0, triggers })
    cy.task("insertException", { caseId: 1, exceptionCode: "HO200212", errorReport: "HO200212||ds:Reason" })

    visitBasePath()

    confirmMultipleFieldsDisplayed(["Case00000", "Case00001", "Case00002"])
    inputAndSearch("reasonCodes", "TRPR0017")
    cy.contains("Hide search panel").click()

    cy.contains("Case00000")
    confirmMultipleFieldsNotDisplayed(["Case00001", "Case00002"])
    cy.get("tbody tr.caseDetailsRow").should("have.length", 1)
    confirmFiltersAppliedContains("TRPR0017")
    removeFilterTagWhilstSearchPanelIsHidden("TRPR0017")

    cy.contains("Show search panel").click()

    inputAndSearch("reasonCodes", "HO200212")
    cy.contains("Hide search panel").click()

    cy.contains("Case00001")
    confirmMultipleFieldsNotDisplayed(["Case00000", "Case00002"])
    cy.get("tr").should("have.length", 2)

    confirmFiltersAppliedContains("HO200212")

    removeFilterTagWhilstSearchPanelIsHidden("HO200212")

    confirmMultipleFieldsDisplayed(["Case00000", "Case00001", "Case00002"])
  })

  it("Should display only filtered reason in the reason column", () => {
    cy.task("insertCourtCasesWithFields", [
      { orgForPoliceFilter: "011111" },
      { orgForPoliceFilter: "011111" },
      { orgForPoliceFilter: "011111" }
    ])
    const triggers: TestTrigger[] = [
      {
        triggerId: 0,
        triggerCode: TriggerCode.TRPR0017,
        status: "Unresolved",
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      },
      {
        triggerId: 1,
        triggerCode: TriggerCode.TRPR0015,
        status: "Unresolved",
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      }
    ]

    cy.task("insertTriggers", { caseId: 0, triggers })
    cy.task("insertException", { caseId: 0, exceptionCode: "HO200212", errorReport: "HO200212||ds:Reason" })
    cy.task("insertException", { caseId: 0, exceptionCode: "HO200200", errorReport: "HO200200||ds:Reason" })

    cy.task("insertTriggers", { caseId: 1, triggers })
    cy.task("insertException", { caseId: 1, exceptionCode: "HO200212", errorReport: "HO200212||ds:Reason" })
    cy.task("insertException", { caseId: 1, exceptionCode: "HO200239", errorReport: "HO200239||ds:Reason" })

    cy.task("insertTriggers", { caseId: 2, triggers })
    cy.task("insertException", { caseId: 2, exceptionCode: "HO200247", errorReport: "HO200247||ds:Reason" })
    cy.task("insertException", { caseId: 2, exceptionCode: "HO200212", errorReport: "HO200212||ds:Reason" })

    cy.visit("/bichard")

    tableRowShouldContain(0, "HO200212", "HO200200", "PR15 - Personal details changed", "PR17")
    tableRowShouldContain(1, "HO200212", "HO200239", "PR15 - Personal details changed", "PR17")
    tableRowShouldContain(2, "HO200247", "HO200212", "PR15 - Personal details changed", "PR17")

    visitBasePath()
    inputAndSearch("reasonCodes", "HO200212")

    confirmFiltersAppliedContains("HO200212")
    tableRowShouldContain(0, "HO200212")
    tableRowShouldNotContain(0, "HO200200", "PR15 - Personal details changed", "PR17")
    cy.get(".moj-filter-tags").contains("HO200212").click({ force: true })

    visitBasePath()
    inputAndSearch("reasonCodes", "HO200200")

    confirmFiltersAppliedContains("HO200200")
    tableRowShouldContain(0, "HO200200")
    tableRowShouldNotContain(0, "HO200212", "PR15 - Personal details changed", "PR17")
    cy.get(".moj-filter-tags").contains("HO200200").click({ force: true })

    visitBasePath()
    inputAndSearch("reasonCodes", "HO200247")

    confirmFiltersAppliedContains("HO200247")
    tableRowShouldContain(0, "HO200247")
    tableRowShouldNotContain(0, "HO200212", "PR15 - Personal details changed", "PR17")
    cy.get(".moj-filter-tags").contains("HO200247").click({ force: true })

    visitBasePath()
    inputAndSearch("reasonCodes", "PR15")

    confirmFiltersAppliedContains("PR15")
    tableRowShouldContain(0, "PR15")
    tableRowShouldContain(1, "PR15")
    tableRowShouldContain(2, "PR15")
    tableRowShouldNotContain(0, "HO200212", "HO200200", "PR17")
    tableRowShouldNotContain(1, "HO200212", "HO200239", "PR17")
    tableRowShouldNotContain(2, "HO200247", "HO200212", "PR17")
  })

  it("Should display cases filtered by short reason code", () => {
    cy.task("insertCourtCasesWithFields", [
      { orgForPoliceFilter: "011111" },
      { orgForPoliceFilter: "011111" },
      { orgForPoliceFilter: "011111" }
    ])

    const triggers: TestTrigger[] = [
      {
        triggerId: 0,
        triggerCode: TriggerCode.TRPR0017,
        status: "Unresolved",
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      },
      {
        triggerId: 1,
        triggerCode: TriggerCode.TRPR0011,
        status: "Unresolved",
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      }
    ]
    cy.task("insertTriggers", { caseId: 0, triggers })
    cy.task("insertException", { caseId: 1, exceptionCode: "HO200212", errorReport: "HO200212||ds:Reason" })

    visitBasePath()
    inputAndSearch("reasonCodes", "PR17")

    cy.contains("Case00000")
    cy.get("tbody tr.caseDetailsRow").should("have.length", 1)
    tableRowShouldContain(0, "PR17")
    confirmFiltersAppliedContains("PR17")

    visitBasePath()
    inputAndSearch("reasonCodes", "PR17 PR11")
    tableRowShouldContain(0, "PR17", "PR11")

    visitBasePath()
    inputAndSearch("reasonCodes", "PR17 PR11")
    tableRowShouldContain(0, "PR17", "PR11")

    visitBasePath()
    inputAndSearch("reasonCodes", "PR17 PR17")
    confirmFiltersAppliedContains("PR17")
    cy.get(".moj-filter-tags").get("PR17").should("not.exist")
    tableRowShouldContain(0, "PR17")
  })

  it("Should display cases filtered by multiple reason codes", () => {
    cy.task("insertCourtCasesWithFields", [
      { orgForPoliceFilter: "011111" },
      { orgForPoliceFilter: "011111" },
      { orgForPoliceFilter: "011111" }
    ])

    const triggers: TestTrigger[] = [
      {
        triggerId: 0,
        triggerCode: TriggerCode.TRPR0017,
        status: "Unresolved",
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      }
    ]
    cy.task("insertTriggers", { caseId: 0, triggers })
    cy.task("insertException", { caseId: 1, exceptionCode: "HO200212", errorReport: "HO200212||ds:Reason" })

    visitBasePath()

    inputAndSearch("reasonCodes", "PR17 HO200212")
    cy.contains("Case00000")
    cy.contains("Case00001")
    confirmMultipleFieldsNotDisplayed(["Case00002"])
    cy.get("tbody tr.caseDetailsRow").should("have.length", 2)
    confirmFiltersAppliedContains("PR17")
    confirmFiltersAppliedContains("HO200212")

    visitBasePath()
    inputAndSearch("reasonCodes", "PR17 PR17")
    confirmFiltersAppliedContains("PR17")
    cy.get(".moj-filter-tags").should("have.length", 1)
    tableRowShouldContain(0, "PR17")
  })

  it("Should let users use all search fields", () => {
    cy.task("insertCourtCasesWithFields", [
      { defendantName: "WAYNE Bruce", courtName: "London Court", ptiurn: "Case00001", orgForPoliceFilter: "011111" },
      { defendantName: "GORDON Bruce", courtName: "London Court", ptiurn: "Case00002", orgForPoliceFilter: "011111" },
      {
        defendantName: "PENNYWORTH Bruce",
        courtName: "Manchester Court",
        ptiurn: "Case00003",
        orgForPoliceFilter: "011111"
      },
      {
        defendantName: "PENNYWORTH Alfred",
        courtName: "London Court",
        ptiurn: "Case00004",
        orgForPoliceFilter: "011111"
      }
    ])
    cy.task("insertException", { caseId: 0, exceptionCode: "HO200212", errorReport: "HO200212||ds:Reason" })
    cy.task("insertException", { caseId: 1, exceptionCode: "HO200213", errorReport: "HO200213||ds:Reason" })
    cy.task("insertException", { caseId: 2, exceptionCode: "HO200214", errorReport: "HO200214||ds:Reason" })

    visitBasePath()

    inputAndSearch("defendantName", "Bruce")
    confirmMultipleFieldsNotDisplayed(["PENNYWORTH Alfred", "WAYNE Bruce", "GORDON Bruce", "PENNYWORTH Bruce"])
    cy.get("tr").should("have.length", 0)
    confirmMultipleFieldsDisplayed([])

    inputAndSearch("defendantName", "*Bruce")
    confirmMultipleFieldsNotDisplayed(["PENNYWORTH Alfred"])
    cy.get("tr").should("have.length", 4)
    confirmMultipleFieldsDisplayed(["WAYNE Bruce", "GORDON Bruce", "PENNYWORTH Bruce"])

    inputAndSearch("defendantName", " Bruce")
    confirmMultipleFieldsNotDisplayed(["PENNYWORTH Alfred"])
    cy.get("tr").should("have.length", 4)
    confirmMultipleFieldsDisplayed(["WAYNE Bruce", "GORDON Bruce", "PENNYWORTH Bruce"])

    inputAndSearch("courtName", "London Court")
    confirmMultipleFieldsNotDisplayed(["PENNYWORTH Bruce", "PENNYWORTH Alfred"])
    cy.get("tr").should("have.length", 3)
    confirmMultipleFieldsDisplayed(["WAYNE Bruce", "GORDON Bruce"])

    inputAndSearch("ptiurn", "Case0000")
    confirmMultipleFieldsNotDisplayed(["PENNYWORTH Bruce", "PENNYWORTH Alfred"])
    cy.get("tr").should("have.length", 3)
    confirmMultipleFieldsDisplayed(["WAYNE Bruce", "GORDON Bruce"])
    cy.get(".moj-filter__tag").contains("Case0000").click()

    inputAndSearch("reasonCodes", "HO200212")

    confirmMultipleFieldsNotDisplayed(["GORDON Bruce", "PENNYWORTH Bruce", "PENNYWORTH Alfred"])
    cy.get("tr").should("have.length", 2)
    confirmMultipleFieldsDisplayed(["WAYNE Bruce"])
  })

  it("Should display cases filtered for an SLA date", () => {
    const force = "011111"

    const todayDate = new Date()
    const yesterdayDate = subDays(todayDate, 1)
    const day2Date = subDays(todayDate, 2)
    const day3Date = subDays(todayDate, 3)
    const aLongTimeAgoDate = new Date("2001-09-26")

    const dateFormatString = "dd/MM/yyyy"
    const day2DateString = format(day2Date, dateFormatString)
    const day3DateString = format(day3Date, dateFormatString)
    const day15DateString = format(subDays(todayDate, 15), dateFormatString)

    cy.task("insertCourtCasesWithFields", [
      { courtDate: todayDate, orgForPoliceFilter: force },
      { courtDate: yesterdayDate, orgForPoliceFilter: force },
      { courtDate: yesterdayDate, orgForPoliceFilter: force },
      { courtDate: day2Date, orgForPoliceFilter: force },
      { courtDate: day3Date, orgForPoliceFilter: force },
      { courtDate: day3Date, orgForPoliceFilter: force },
      { courtDate: day3Date, orgForPoliceFilter: force },
      { courtDate: aLongTimeAgoDate, orgForPoliceFilter: force }
    ])

    visitBasePath()

    // Tests for "Today"
    filterByCaseAge(`label[for="case-age-today"]`)
    cy.get('label[for="case-age-today"]').should("have.text", "Today (1)")
    cy.get("button#search").click()

    cy.get(".moj-scrollable-pane tbody tr").should("have.length", 1)
    cy.get("tr")
      .not(":first")
      .each((row) => {
        cy.wrap(row).contains("Case00000").should("exist")
      })

    cy.get(".moj-filter__tag").contains("Today").click()
    cy.get("button#search").click()

    cy.get(".moj-scrollable-pane tbody tr").should("have.length", 8)

    // Tests for "yesterday"
    filterByCaseAge(`label[for="case-age-yesterday"]`)
    cy.get('label[for="case-age-yesterday"]').should("have.text", "Yesterday (2)")
    cy.get("button#search").click()

    cy.get(".moj-scrollable-pane tbody tr").should("have.length", 2)
    confirmMultipleFieldsDisplayed(["Case00001", "Case00002"])
    confirmMultipleFieldsNotDisplayed(["Case00000", "Case00003", "Case00004", "Case00005", "Case00006", "Case00007"])

    cy.get(".moj-filter__tag").contains("Yesterday").click()
    cy.get("button#search").click()
    cy.get(".moj-scrollable-pane tbody tr").should("have.length", 8)

    // // Tests for "2 days ago"
    cy.get('label[for="case-age-2-days-ago"]').should("have.text", `2 days ago (${day2DateString}) (1)`)
    filterByCaseAge(`label[for="case-age-2-days-ago"]`)
    cy.get("button#search").click()

    cy.get(".moj-scrollable-pane tbody tr").should("have.length", 1)
    cy.get("tr")
      .not(":first")
      .each((row) => {
        cy.wrap(row).contains("Case00003").should("exist")
      })

    cy.get(".moj-filter__tag").contains("2 days ago").click()
    cy.get("button#search").click()
    cy.get(".moj-scrollable-pane tbody tr").should("have.length", 8)

    // // Tests for "3 days ago"
    cy.get('label[for="case-age-3-days-ago"]').should("have.text", `3 days ago (${day3DateString}) (3)`)
    filterByCaseAge(`label[for="case-age-3-days-ago"]`)
    cy.get("button#search").click()

    cy.get(".moj-scrollable-pane tbody tr").should("have.length", 3)
    confirmMultipleFieldsDisplayed(["Case00004", "Case00005", "Case00006"])
    confirmMultipleFieldsNotDisplayed(["Case00000", "Case00001", "Case00002", "Case00003", "Case00007"])

    cy.get(".moj-filter__tag").contains("3 days ago").click()
    cy.get("button#search").click()
    cy.get(".moj-scrollable-pane tbody tr").should("have.length", 8)

    // // Tests for "15 days ago and older"
    cy.get('label[for="case-age-15-days-ago-and-older"]').should(
      "have.text",
      `15 days ago and older (up to ${day15DateString}) (1)`
    )

    filterByCaseAge(`label[for="case-age-15-days-ago-and-older"]`)

    cy.get("button#search").click()

    cy.get(".moj-scrollable-pane tbody tr").should("have.length", 1)
    confirmMultipleFieldsDisplayed(["Case00007"])
    confirmMultipleFieldsNotDisplayed([
      "Case00000",
      "Case00001",
      "Case00002",
      "Case00003",
      "Case00004",
      "Case00005",
      "Case00006"
    ])

    cy.get(".moj-filter__tag").contains("15 days ago and older").click()
    cy.get("button#search").click()
    cy.get(".moj-scrollable-pane tbody tr").should("have.length", 8)

    // // Test for multiple SLA

    filterByCaseAge(`label[for="case-age-today"]`)
    filterByCaseAge(`label[for="case-age-3-days-ago"]`)

    cy.get("button#search").click()

    cy.get(".moj-scrollable-pane tbody tr").should("have.length", 4)
    confirmMultipleFieldsDisplayed(["Case00000", "Case00004", "Case00005", "Case00006"])
    confirmMultipleFieldsNotDisplayed(["Case00001", "Case00002", "Case00003", "Case00007"])

    cy.get(".moj-filter__tag").contains("3 days ago").click()
    cy.get("button#search").click()
    cy.get(".moj-scrollable-pane tbody tr").should("have.length", 1)

    cy.get(".moj-filter__tag").contains("Today").click()
    cy.get("button#search").click()
    cy.get(".moj-scrollable-pane tbody tr").should("have.length", 8)
  })

  it("Should display cases filtered for a date range", () => {
    const force = "011111"

    cy.task("insertCourtCasesWithFields", [
      { courtDate: new Date("2023-01-1"), orgForPoliceFilter: force },
      { courtDate: new Date("2023-02-1"), orgForPoliceFilter: force },
      { courtDate: new Date("2022-12-1"), orgForPoliceFilter: force },
      { courtDate: new Date("2022-11-15"), orgForPoliceFilter: force },
      { courtDate: new Date("2022-11-2"), orgForPoliceFilter: force },
      { courtDate: new Date("2022-10-30"), orgForPoliceFilter: force },
      { courtDate: new Date("2022-10-15"), orgForPoliceFilter: force },
      { courtDate: new Date("2022-10-1"), orgForPoliceFilter: force },
      { courtDate: new Date("2022-09-15"), orgForPoliceFilter: force },
      { courtDate: new Date("2021-12-15"), orgForPoliceFilter: force },
      { courtDate: new Date("2021-02-10"), orgForPoliceFilter: force },
      { courtDate: new Date("2020-05-30"), orgForPoliceFilter: force },
      { courtDate: new Date("2019-05-10"), orgForPoliceFilter: force }
    ])

    cy.visit("/bichard")

    cy.get(`label[for="date-range"]`).click()
    cy.get(`label[for="date-from"]`).type("2022-01-01")
    cy.get(`label[for="date-to"]`).type("2022-12-31")
    cy.get(".govuk-heading-s").contains("Date range").should("exist")
    cy.get(".moj-filter__tag").contains("01/01/2022 - 31/12/2022")
    cy.get("button#search").click()

    cy.get(`label[for="date-range"]`).click()
    cy.get("#date-range").should("be.checked")
    cy.get("#date-from").should("have.value", "2022-01-01")
    cy.get("#date-to").should("have.value", "2022-12-31")

    cy.get(".moj-scrollable-pane tbody tr").should("have.length", 7)

    cy.contains("Hide search panel").click()

    confirmFiltersAppliedContains("01/01/2022 - 31/12/2022")
    removeFilterTagWhilstSearchPanelIsHidden("01/01/2022 - 31/12/2022")
    cy.get(".moj-scrollable-pane tbody tr").should("have.length", 13)
  })

  it("Should update 'selected filter' chip when changing date range filter", () => {
    cy.visit("/bichard")
    cy.get(`label[for="date-range"]`).click()

    cy.get(`label[for="date-from"]`).type("1999-01-01")
    cy.get(`label[for="date-to"]`).type("2000-12-31")
    cy.get(".govuk-heading-s").contains("Date range").should("exist")
    cy.get(".moj-filter__tag").contains("01/01/1999 - 31/12/2000")

    cy.get(`label[for="date-from"]`).type("2022-01-01")
    cy.get(`label[for="date-to"]`).type("2022-12-31")
    cy.get(".moj-filter__tag").contains("01/01/2022 - 31/12/2022")
  })

  it("Should not allow passing an invalid case age filter", () => {
    const force = "011111"
    cy.task("insertCourtCasesWithFields", [
      { courtDate: new Date(), orgForPoliceFilter: force },
      { courtDate: subDays(new Date(), 1), orgForPoliceFilter: force },
      { courtDate: addDays(new Date(), 1), orgForPoliceFilter: force }
    ])

    cy.visit("/bichard?caseAge=invalid")
    cy.get(".moj-scrollable-pane tbody tr").should("have.length", 3)
  })

  it("Should filter cases by whether they have triggers and exceptions", () => {
    cy.task("insertCourtCasesWithFields", [
      { orgForPoliceFilter: "011111" },
      { orgForPoliceFilter: "011111", errorCount: 0, errorStatus: null, errorReason: "", errorReport: "" },
      { orgForPoliceFilter: "011111" }
    ])
    const triggers: TestTrigger[] = [
      {
        triggerId: 0,
        triggerCode: TriggerCode.TRPR0001,
        status: "Unresolved",
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      }
    ]
    cy.task("insertTriggers", { caseId: 0, triggers })
    cy.task("insertException", { caseId: 0, exceptionCode: "HO100206" })
    cy.task("insertTriggers", { caseId: 1, triggers })
    cy.task("insertException", { caseId: 2, exceptionCode: "HO100207" })

    cy.visit("/bichard")

    // Default: no filter, all cases shown
    confirmMultipleFieldsDisplayed(["Case00000", "Case00001", "Case00002"])

    // Filtering with triggers
    cy.get(`label[for="triggers-reason"]`).click()
    cy.get("button[id=search]").click()

    cy.get('*[class^="moj-filter-tags"]').contains("Triggers")

    confirmMultipleFieldsDisplayed(["Case00000", "Case00001"])
    confirmMultipleFieldsNotDisplayed(["Case00002"])

    // Filtering with exceptions
    cy.get(`label[for="exceptions-reason"]`).click()
    cy.get("button[id=search]").click()

    cy.get('*[class^="moj-filter-tags"]').contains("Exceptions")

    confirmMultipleFieldsDisplayed(["Case00000", "Case00002"])
    confirmMultipleFieldsNotDisplayed(["Case00001"])

    // Filter for both triggers and exceptions
    cy.get(`label[for="all-reason"]`).click()
    cy.get("button[id=search]").click()

    cy.contains('*[class^="moj-filter-tags"]').should("not.exist")

    confirmMultipleFieldsDisplayed(["Case00000", "Case00001", "Case00002"])
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
      }
    ])

    visitBasePath()

    // Filter for unresolved cases by default
    cy.get(".moj-scrollable-pane tbody tr").should("have.length", 1)
    cy.contains("Case00000")

    // Filter for resolved cases
    cy.get(`label[for="resolved"]`).click()
    cy.get("button[id=search]").click()

    cy.get(".moj-scrollable-pane tbody tr").should("have.length", 1)
    cy.contains("Case00001")

    // Removing case state filter tag unresolved cases should be shown with the filter disabled
    cy.get(".moj-filter__tag").contains("Resolved").click()
    cy.get("button[id=search]").click()
    cy.get(".moj-scrollable-pane tbody tr").should("have.length", 1)
  })

  it("Should filter cases by locked state", () => {
    cy.task("insertCourtCasesWithFields", [
      {
        errorLockedByUsername: "BichardForce01",
        triggerLockedByUsername: "BichardForce01",
        orgForPoliceFilter: "011111"
      },
      { orgForPoliceFilter: "011111" }
    ])

    visitBasePath()
    // Filter for locked cases
    cy.get(`label[for="locked-state-locked"]`).click()
    cy.get("button[id=search]").click()

    cy.get(".moj-scrollable-pane tbody tr").should("have.length", 1)
    cy.contains("Case00000")

    // Removing locked filter tag all case should be shown with the filter disabled
    cy.get(".moj-filter__tag").contains("Locked").click()
    cy.get("button[id=search]").click()

    cy.get(".moj-scrollable-pane tbody tr").should("have.length", 2)

    // Filter for unlocked cases
    cy.get(`label[for="locked-state-unlocked"]`).click()
    cy.get("button[id=search]").click()

    cy.get(".moj-scrollable-pane tbody tr").should("have.length", 1)
    cy.contains("Case00001")

    // Removing unlocked filter tag all case should be shown with the filter disabled
    cy.get(".moj-filter__tag").contains("Unlocked").click()
    cy.get("button[id=search]").click()
    cy.get(".moj-scrollable-pane tbody tr").should("have.length", 2)
  })

  it("Should clear filters when clicked on the link outside of the filter panel", () => {
    visitBasePath()
    cy.get("input[id=defendantName]").type("Dummy")
    cy.get('label[for="exceptions-reason"]').click()
    cy.get("button[id=search]").click()

    cy.get('*[class^="moj-filter-tags"]').contains("Dummy")
    cy.get('*[class^="moj-filter-tags"]').contains("Exceptions")

    cy.get("#clear-filters").click()

    cy.get('*[class^="moj-filter-tags"]').should("not.exist")
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/bichard")
    })
  })

  it("Should clear filters when clicked on the link inside the filter panel", () => {
    visitBasePath()
    cy.get("input[id=defendantName]").type("Dummy")
    cy.get('label[for="triggers-reason"]').click()
    cy.get("button[id=search]").click()

    cy.get('*[class^="moj-filter-tags"]').contains("Dummy")
    cy.get('*[class^="moj-filter-tags"]').contains("Triggers")

    cy.get(".moj-filter__heading-title a").contains("Clear filters").click()

    cy.get('*[class^="moj-filter-tags"]').should("not.exist")
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/bichard")
    })
  })

  describe("Filtering cases by locked status", () => {
    beforeEach(() => {
      cy.task("insertCourtCasesWithFields", [
        {
          errorLockedByUsername: "GeneralHandler",
          triggerLockedByUsername: "GeneralHandler",
          orgForPoliceFilter: "01XY"
        },
        {
          orgForPoliceFilter: "01XY",
          triggerLockedByUsername: "GeneralHandler"
        },
        {
          orgForPoliceFilter: "01XY",
          errorLockedByUsername: "GeneralHandler"
        },
        {
          errorLockedByUsername: "BichardForce02",
          triggerLockedByUsername: "BichardForce02",
          orgForPoliceFilter: "01XY"
        },
        { orgForPoliceFilter: "01XY" }
      ])

      const triggers: TestTrigger[] = [
        {
          triggerId: 0,
          triggerCode: TriggerCode.TRPR0001,
          status: "Unresolved",
          createdAt: new Date("2022-07-09T10:22:34.000Z")
        }
      ]
      cy.task("insertTriggers", { caseId: 0, triggers })
      cy.task("insertTriggers", { caseId: 1, triggers })
      visitBasePath()
    })

    it("Should filter locked cases", () => {
      cy.get(`label[for="locked-state-locked"]`).click()
      cy.contains("Selected filters")
      cy.contains("Locked")

      cy.get("#search").click()

      confirmMultipleFieldsDisplayed(["Case00000", "Case00001", "Case00002", "Case00003"])
      confirmMultipleFieldsNotDisplayed(["Case00004"])
    })

    it("Should filter unlocked cases", () => {
      cy.get(`label[for="locked-state-unlocked"]`).click()
      cy.contains("Selected filters")
      cy.contains("Locked")

      cy.get("#search").click()

      confirmMultipleFieldsDisplayed(["Case00004"])
      confirmMultipleFieldsNotDisplayed(["Case00000", "Case00001", "Case00002", "Case00003"])
    })

    it("Should filter cases that I hold the lock for", () => {
      cy.get(`label[for="locked-state-lockedtome"]`).click()
      cy.contains("Selected filters")
      cy.contains("Locked to me")

      cy.get("#search").click()

      confirmMultipleFieldsDisplayed(["Case00000", "Case00001", "Case00002"])
      confirmMultipleFieldsNotDisplayed(["Case00003", "Case00004"])
    })
  })

  describe("Applied filter section", () => {
    it("Searching for a keyword should not change the state of the search panel visibility", () => {
      visitBasePath()
      inputAndSearch("defendantName", "WAYNE Bruce")

      cy.contains("Show search panel").should("not.exist")
      cy.contains("Hide search panel")
      cy.contains("Filters applied").should("not.exist")
      cy.get(".moj-filter-tags").contains("Clear filters").should("not.exist")
      cy.contains("Applied filters")
    })

    it("Should remove filters when they are clicked", () => {
      visitBasePath()
      cy.get("input[id=reasonCodes]").type("Reason1 Reason2")
      cy.get("input[id=defendantName]").type("Dummy")
      cy.get('label[for="triggers-reason"]').click()
      cy.get("button[id=search]").click()
      cy.get("#filter-button").contains("Hide search panel").click()

      cy.get(`a[id="filter-tag-reason1"]`).should("exist")
      cy.get(`a[id="filter-tag-dummy"]`).should("exist")
      cy.get(`a[id="filter-tag-triggers"]`).should("exist")
      cy.get(`a[id="filter-tag-reason2"]`).should("exist")

      cy.get(`a[id="filter-tag-reason1"]`).click()
      cy.get(`a[id="filter-tag-dummy"]`).click()
      cy.get(`a[id="filter-tag-triggers"]`).click()

      cy.get(`a[id="filter-tag-reason1"]`).should("not.exist")
      cy.get(`a[id="filter-tag-dummy"]`).should("not.exist")
      cy.get(`a[id="filter-tag-triggers"]`).should("not.exist")

      cy.get(`a[id="filter-tag-reason2"]`).should("exist")
    })
  })
})

export {}
