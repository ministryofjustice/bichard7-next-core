import { formatDate, subDays } from "date-fns"
import { loginAndVisit } from "../../support/helpers"
import { insertSampleCases } from "./utils"

describe("exceptions/triggers report type filter", () => {
  beforeEach(() => {
    loginAndVisit("Supervisor", "/bichard/report-selection")
    cy.task("clearCourtCases")
    insertSampleCases()
  })

  it("queries exceptions/triggers and successfully returns only exceptions/triggers", () => {
    cy.get("#report-select").select("Resolved Exceptions/Triggers")
    cy.get("#date-from").type(formatDate(subDays(new Date(), 7), "yyyy-MM-dd"))
    cy.get("#date-to").type(formatDate(new Date(), "yyyy-MM-dd"))

    cy.get("#run-report").click()

    cy.get('section[aria-labelledby="report-group-BichardForce03"]').within(() => {
      cy.get("h3#report-group-BichardForce03").should("exist")

      cy.get("table tbody tr").should("have.length", 1)

      cy.get("table tbody tr td").eq(0).should("have.text", "Ex")
      cy.get("table tbody tr td").eq(2).should("have.text", "Case00003")
    })

    cy.get('section[aria-labelledby="report-group-GeneralHandler"]').within(() => {
      cy.get("h3#report-group-GeneralHandler").should("exist")

      cy.get("table tbody tr").should("have.length", 1)

      cy.get("table tbody tr td").eq(0).should("have.text", "Tr")
      cy.get("table tbody tr td").eq(2).should("have.text", "Case00003")
    })

    cy.get(".results-area table tbody tr").should("not.contain", "bails")
    cy.get(".results-area table tbody tr").should("not.contain", "domVi")
    cy.get(".results-area table tbody tr").should("not.contain", "excepTrig")
  })

  it("queries exceptions/triggers with a date window that should not return anything", () => {
    cy.get("#report-select").select("Resolved Exceptions/Triggers")
    cy.get("#date-from").type(formatDate(subDays(new Date(), 7), "yyyy-MM-dd"))
    cy.get("#date-to").type(formatDate(subDays(new Date(), 1), "yyyy-MM-dd"))

    cy.get("#run-report").click()

    cy.get(".results-area table tbody tr").should("have.length", 0)
  })

  it("queries exceptions/triggers with triggers unchecked and successfully returns only exceptions", () => {
    cy.get("#report-select").select("Resolved Exceptions/Triggers")
    cy.get("#date-from").type(formatDate(subDays(new Date(), 7), "yyyy-MM-dd"))
    cy.get("#date-to").type(formatDate(new Date(), "yyyy-MM-dd"))
    cy.get("#triggers").click()

    cy.get("#run-report").click()

    cy.get(".results-area table tbody tr").should("have.length", 1)
    cy.get("table tbody tr td:nth(0)").should("have.text", "Ex")

    cy.get(".results-area table tbody tr td:nth(2)").should("have.text", "Case00003")
  })

  it("queries exceptions/triggers with exceptions unchecked and successfully returns only triggers", () => {
    cy.get("#report-select").select("Resolved Exceptions/Triggers")
    cy.get("#date-from").type(formatDate(subDays(new Date(), 7), "yyyy-MM-dd"))
    cy.get("#date-to").type(formatDate(new Date(), "yyyy-MM-dd"))
    cy.get("#exceptions").click()

    cy.get("#run-report").click()

    cy.get(".results-area table tbody tr").should("have.length", 1)
    cy.get("table tbody tr td:nth(0)").should("have.text", "Tr")

    cy.get(".results-area table tbody tr td:nth(2)").should("have.text", "Case00003")
  })
})
