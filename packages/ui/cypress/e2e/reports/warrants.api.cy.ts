import { formatDate, subDays } from "date-fns"
import { loginAndVisit } from "../../support/helpers"
import { insertSampleCases } from "./utils"

describe("warrants report type filter", () => {
  beforeEach(() => {
    loginAndVisit("Supervisor", "/bichard/report-selection")
    cy.task("clearCourtCases")
    insertSampleCases()
  })

  it("queries warrants and successfully returns only warrants", () => {
    cy.get("#report-select").select("Warrants")
    cy.get("#date-from").type(formatDate(subDays(new Date(), 7), "yyyy-MM-dd"))
    cy.get("#date-to").type(formatDate(new Date(), "yyyy-MM-dd"))

    cy.get("#run-report").click()

    cy.get(".results-area table tbody tr").should("have.length", 1)

    cy.get(".results-area table th").contains("Warrant Type")

    cy.get(".results-area table tbody tr td:nth(8)").should("have.text", "warrants")
    cy.get(".results-area table tbody tr").contains("Warrants Name")

    cy.get(".results-area table tbody tr").should("not.contain", "bails")
    cy.get(".results-area table tbody tr").should("not.contain", "domVi")
    cy.get(".results-area table tbody tr").should("not.contain", "excepTrig")
  })

  it("queries warrants with a date window that should not return anything", () => {
    cy.get("#report-select").select("Warrants")
    cy.get("#date-from").type(formatDate(subDays(new Date(), 7), "yyyy-MM-dd"))
    cy.get("#date-to").type(formatDate(subDays(new Date(), 1), "yyyy-MM-dd"))

    cy.get("#run-report").click()

    cy.get(".results-area table tbody tr").should("have.length", 0)
  })
})
