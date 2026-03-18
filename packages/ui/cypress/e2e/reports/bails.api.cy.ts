import { formatDate, subDays } from "date-fns"
import { loginAndVisit } from "../../support/helpers"
import { insertSampleCases } from "./utils"

describe("bails report type filter", () => {
  beforeEach(() => {
    loginAndVisit("Supervisor", "/bichard/report-selection")
    cy.task("clearCourtCases")
    insertSampleCases()
  })

  it("queries bails and successfully displays only bails", () => {
    cy.get("#report-select").select("Bail Conditions")
    cy.get("#date-from").type(formatDate(subDays(new Date(), 7), "yyyy-MM-dd"))
    cy.get("#date-to").type(formatDate(new Date(), "yyyy-MM-dd"))

    cy.get("#run-report").click()

    cy.get(".results-area table tbody tr").should("have.length", 1)

    const expectedHeaders = [
      "Hearing Date",
      "Court Name",
      "Hearing Time",
      "Defendant Name",
      "Defendant Address",
      "Date of Birth",
      "PTIURN",
      "ASN",
      "Offence Title(s)",
      "Next Court Appearance",
      "Next Court Appearance Date",
      "Next Court Appearance Time",
      "Date/Time Received by CJSE",
      "Number of days taken to enter Portal",
      "Bail Conditions Imposed",
      "Case successfully automated to PNC",
      "Trigger Status",
      "Trigger Resolved Date"
    ]

    expectedHeaders.forEach((headerText, index) => {
      cy.get(".results-area table th").eq(index).should("have.text", headerText)
    })

    cy.get(".results-area table tbody tr td:nth(6)").should("have.text", "bail")
    cy.get(".results-area table tbody tr").contains("Bail Name")

    cy.get(".results-area table tbody tr").should("not.contain", "DomesticViolence Name")
    cy.get(".results-area table tbody tr").should("not.contain", "Warrants Name")
  })

  it("queries bails with a date window that should not return anything", () => {
    cy.get("#report-select").select("Bail Conditions")
    cy.get("#date-from").type(formatDate(subDays(new Date(), 7), "yyyy-MM-dd"))
    cy.get("#date-to").type(formatDate(subDays(new Date(), 1), "yyyy-MM-dd"))

    cy.get("#run-report").click()

    cy.get(".results-area table tbody tr").should("have.length", 0)
  })
})
