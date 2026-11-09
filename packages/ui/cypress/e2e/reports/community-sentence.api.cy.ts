import { formatDate, subDays } from "date-fns"
import { loginAndVisit } from "../../support/helpers"
import { insertSampleCases } from "./utils"

describe("community sentence report type filter", () => {
  beforeEach(() => {
    loginAndVisit("CommunitySentenceReport", "/bichard/report-selection")
    cy.task("clearCourtCases")
    insertSampleCases()
  })

  it("queries community sentence and successfully displays table", () => {
    cy.get("#report-select").select("Community sentence")
    cy.get("#date-from").type(formatDate(subDays(new Date(), 7), "yyyy-MM-dd"))
    cy.get("#date-to").type(formatDate(new Date(), "yyyy-MM-dd"))
    cy.get('[data-testid="checkbox-all"]').check()

    cy.get("#run-report").click()

    cy.get(".results-area table tbody tr").should("have.length", 4)

    const headers = [
      "Date received",
      "Name",
      "Date of birth",
      "PNCID",
      "Offence",
      "Domestic violence case",
      "Suspended Sentence Order duration (months)",
      "Custodial Sentence Order duration (months)",
      "Date of sentence",
      "Expiry",
      "Home address",
      "Offence address",
      "Offence start date",
      "Arrest date",
      "Charge date",
      "Plea",
      "Result code"
    ]

    headers.forEach((text, index) => {
      cy.get(".results-area table th").eq(index).should("have.text", text)
    })
  })

  it("queries community sentence with a single result code selected in the filter", () => {
    cy.get("#report-select").select("Community sentence")
    cy.get("#date-from").type(formatDate(subDays(new Date(), 7), "yyyy-MM-dd"))
    cy.get("#date-to").type(formatDate(new Date(), "yyyy-MM-dd"))
    cy.get("#selected-options summary").click()
    cy.get('[data-testid="checkbox-4"]').check()

    cy.intercept("GET", "/bichard/api/reports*").as("runReport")

    cy.get("#run-report").click()

    cy.wait("@runReport")

    cy.get(".results-area table tbody tr").should("have.length", 4)

    cy.get(".results-area table tbody tr:nth(0) td:nth(16)").should("have.text", "1030")
    cy.get(".results-area table tbody tr:nth(1) td:nth(16)").should("have.text", "1030")
    cy.get(".results-area table tbody tr:nth(2) td:nth(16)").should("have.text", "1030")
    cy.get(".results-area table tbody tr:nth(3) td:nth(16)").should("have.text", "1030")
  })

  it("queries community sentence with a date window that should not return anything", () => {
    cy.get("#report-select").select("Community sentence")
    cy.get("#date-from").type(formatDate(subDays(new Date(), 7), "yyyy-MM-dd"))
    cy.get("#date-to").type(formatDate(subDays(new Date(), 1), "yyyy-MM-dd"))
    cy.get('[data-testid="checkbox-all"]').check()

    cy.intercept("GET", "/bichard/api/reports*").as("runReport")

    cy.get("#run-report").click()

    cy.wait("@runReport")

    cy.get(".results-area").find("table").should("not.exist")
  })

  it("queries community sentence with a result code filter that should not return anything", () => {
    cy.get("#report-select").select("Community sentence")
    cy.get("#date-from").type(formatDate(subDays(new Date(), 7), "yyyy-MM-dd"))
    cy.get("#date-to").type(formatDate(new Date(), "yyyy-MM-dd"))
    cy.get("#selected-options summary").click()
    cy.get('[data-testid="checkbox-0"]').check()

    cy.intercept("GET", "/bichard/api/reports*").as("runReport")

    cy.get("#run-report").click()

    cy.wait("@runReport")

    cy.get(".results-area").find("table").should("not.exist")
  })
})
