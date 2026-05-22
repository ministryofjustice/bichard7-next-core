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
    cy.get("#report-select").select("Bail conditions")
    cy.get("#date-from").type(formatDate(subDays(new Date(), 7), "yyyy-MM-dd"))
    cy.get("#date-to").type(formatDate(new Date(), "yyyy-MM-dd"))

    cy.get("#run-report").click()

    cy.get(".results-area table tbody tr").should("have.length", 1)

    const expectedHeaders = [
      "Hearing date",
      "Court name",
      "Hearing time",
      "Defendant name",
      "Defendant address",
      "Date of birth",
      "PTIURN",
      "ASN",
      "Offence title(s)",
      "Next court appearance",
      "Next court appearance date",
      "Next court appearance time",
      "Date/time received by CJSE",
      "Number of days taken to enter portal",
      "Bail conditions imposed",
      "Case successfully automated to PNC",
      "Trigger status",
      "Trigger resolved date"
    ]

    expectedHeaders.forEach((headerText, index) => {
      cy.get(".results-area table th").eq(index).should("have.text", headerText)
    })

    cy.get(".results-area table tbody tr td:nth(6)").should("have.text", "bail")
    cy.get(".results-area table tbody tr td:nth(3)").contains("Bail Name")

    cy.get(".results-area table tbody tr").should("not.contain", "DomesticViolence Name")
    cy.get(".results-area table tbody tr").should("not.contain", "Warrants Name")
  })

  it("queries bails with a date window that should not return anything", () => {
    cy.get("#report-select").select("Bail conditions")
    cy.get("#date-from").type(formatDate(subDays(new Date(), 7), "yyyy-MM-dd"))
    cy.get("#date-to").type(formatDate(subDays(new Date(), 1), "yyyy-MM-dd"))

    cy.get("#run-report").click()

    cy.get(".results-area table tbody tr").should("have.length", 0)
  })
})
