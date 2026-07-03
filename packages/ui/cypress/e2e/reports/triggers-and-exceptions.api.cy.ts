import { formatDate, subDays } from "date-fns"
import { loginAndVisit } from "../../support/helpers"
import { insertSampleCases } from "./utils"

describe("exceptions/triggers report type filter", () => {
  beforeEach(() => {
    loginAndVisit("Supervisor", "/bichard/report-selection")
    cy.task("clearCourtCases")
    insertSampleCases()
  })

  const provideAllFieldsWithValidValues = () => {
    cy.get("#report-select").select("Resolved exceptions and triggers")
    cy.get("#date-from").type(formatDate(subDays(new Date(), 7), "yyyy-MM-dd"))
    cy.get("#date-to").type(formatDate(new Date(), "yyyy-MM-dd"))
    cy.get("div#resolved-by-section").find("input[data-testid='audit-resolved-by-all']").check()
  }

  it("queries exceptions/triggers and successfully displays only exceptions/triggers", () => {
    provideAllFieldsWithValidValues()
    cy.get("#run-report").click()

    const headers = [
      "Type",
      "ASN",
      "PTIURN",
      "Defendant name",
      "Court name",
      "Courtroom",
      "Hearing date",
      "Case reference",
      "Date/time received by CJSE",
      "Date/time resolved",
      "Notes",
      "Resolution action"
    ]

    cy.get("section#table-user1-1-section").within(() => {
      cy.get("h3#table-user1-1-header").should("exist")

      headers.forEach((text, index) => {
        cy.get("table thead tr th").eq(index).should("have.text", text)
      })

      cy.get("table tbody tr").should("have.length", 1)

      cy.get("table tbody tr td:nth(0)").should("have.text", "Ex")
      cy.get("table tbody tr td:nth(2)").should("have.text", "Case00003")
    })

    cy.get("section#table-generalhandler-0-section").within(() => {
      cy.get("h3#table-generalhandler-0-header").should("exist")

      cy.get("table tbody tr").should("have.length", 1)

      headers.forEach((text, index) => {
        cy.get("table thead tr th").eq(index).should("have.text", text)
      })

      cy.get("table tbody tr td:nth(0)").should("have.text", "Tr")
      cy.get("table tbody tr td:nth(2)").should("have.text", "Case00003")
    })

    cy.get(".results-area table tbody tr").should("not.contain", "Bails Name")
    cy.get(".results-area table tbody tr").should("not.contain", "DomesticViolence Name")
  })

  it("queries exceptions/triggers with a date window that should not return anything", () => {
    provideAllFieldsWithValidValues()
    cy.get("#date-from").type(formatDate(subDays(new Date(), 7), "yyyy-MM-dd"))
    cy.get("#date-to").type(formatDate(subDays(new Date(), 1), "yyyy-MM-dd"))

    cy.get("#run-report").click()

    cy.get(".results-area table tbody tr").should("have.length", 0)
  })

  it("queries exceptions/triggers with triggers unchecked and successfully returns only exceptions", () => {
    provideAllFieldsWithValidValues()
    cy.get("#triggers").click()

    cy.get("#run-report").click()

    cy.get(".results-area table tbody tr").should("have.length", 1)
    cy.get("table tbody tr td:nth(0)").should("have.text", "Ex")

    cy.get(".results-area table tbody tr td:nth(2)").should("have.text", "Case00003")
  })

  it("queries exceptions/triggers with exceptions unchecked and successfully returns only triggers", () => {
    provideAllFieldsWithValidValues()
    cy.get("#exceptions").click()

    cy.get("#run-report").click()

    cy.get(".results-area table tbody tr").should("have.length", 1)
    cy.get("table tbody tr td:nth(0)").should("have.text", "Tr")

    cy.get(".results-area table tbody tr td:nth(2)").should("have.text", "Case00003")
  })

  it("returns results that have been resolved by the selected resolver", () => {
    provideAllFieldsWithValidValues()
    cy.get("div#resolved-by-section").find("input[data-testid='audit-resolved-by-all']").uncheck()
    cy.get("div#resolved-by-section").contains("General Handler User").click()

    cy.get("#run-report").click()

    cy.get(".results-area table tbody tr").should("have.length", 1)
    cy.get(".results-area h3").should("contain", "GeneralHandler")
  })

  it("returns no results when querying with a 'resolvedBy' user that has not resolved anything", () => {
    provideAllFieldsWithValidValues()
    cy.get("div#resolved-by-section").find("input[data-testid='audit-resolved-by-all']").uncheck()
    cy.get("div#resolved-by-section").contains("Supervisor User").click()

    cy.get("#run-report").click()

    cy.get(".results-area output").should("have.text", "No results found for the selected criteria.")
  })

  it("returns all results when all resolvers checkbox checked", () => {
    provideAllFieldsWithValidValues()

    cy.get("#run-report").click()

    cy.get(".results-area table tbody tr").should("have.length", 2)
    cy.get(".results-area h3").should("contain", "GeneralHandler")
    cy.get(".results-area h3").should("contain", "user1")
  })
})
