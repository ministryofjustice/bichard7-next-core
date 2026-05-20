import { format, subDays } from "date-fns"
import { loginAndVisit } from "../../support/helpers"
import { insertSampleCases } from "./utils"

describe("User Summary Report", () => {
  beforeEach(() => {
    loginAndVisit("Supervisor", "/bichard/report-selection")
    cy.task("clearCourtCases")
  })

  it("should generate the User Summary report and display the correct totals and user data", () => {
    insertSampleCases()

    const today = new Date()
    const fromDate = format(subDays(today, 7), "yyyy-MM-dd")
    const toDate = format(today, "yyyy-MM-dd")
    const formattedGroupDate = format(today, "dd/MM/yyyy")

    cy.get("#report-select").select("User Performance Summary")
    cy.get("#date-from").type(fromDate)
    cy.get("#date-to").type(toDate)
    cy.get("#run-report").click()

    cy.get(".report-container").should("be.visible")

    cy.get("h3").first().as("groupHeader")
    cy.get("@groupHeader").should("contain.text", formattedGroupDate)
    cy.get("@groupHeader").should("contain.text", "Exceptions Resolved: 1")
    cy.get("@groupHeader").should("contain.text", "Triggers Resolved: 1")
    cy.get("@groupHeader").should("contain.text", "Exceptions/Triggers Locked: 1")

    cy.get("table").first().as("reportTable")
    cy.get("@reportTable").find("th").eq(0).should("have.text", "Name")
    cy.get("@reportTable").find("th").eq(1).should("have.text", "Exceptions Resolved Today")
    cy.get("@reportTable").find("th").eq(2).should("have.text", "Triggers Resolved Today")
    cy.get("@reportTable").find("th").eq(3).should("have.text", "Total Exceptions/Triggers Still Locked")

    cy.get("@reportTable").find("tbody tr").should("have.length", 2)

    cy.get("@reportTable")
      .contains("tr", "user1")
      .within(() => {
        cy.get("td").eq(1).should("contain.text", "1") // Exceptions Resolved
        cy.get("td").eq(2).should("contain.text", "0") // Triggers Resolved
        cy.get("td").eq(3).should("contain.text", "0") // Locked
      })

    cy.get("@reportTable")
      .contains("tr", "General Handler User")
      .within(() => {
        cy.get("td").eq(1).should("contain.text", "0") // Exceptions Resolved
        cy.get("td").eq(2).should("contain.text", "1") // Triggers Resolved
        cy.get("td").eq(3).should("contain.text", "1") // Locked
      })
  })

  it("should handle no report data", () => {
    const today = new Date()
    const fromDate = format(subDays(today, 7), "yyyy-MM-dd")
    const toDate = format(today, "yyyy-MM-dd")

    cy.get("#report-select").select("User Performance Summary")
    cy.get("#date-from").type(fromDate)
    cy.get("#date-to").type(toDate)
    cy.get("#run-report").click()

    cy.get(".report-container").should("be.visible")

    cy.get(".report-container > section").each((_, index) => {
      const expectedGroupDate = format(subDays(today, index), "dd/MM/yyyy")

      cy.get(".report-container > section").eq(index).find("h3").as("groupHeader")

      cy.get("@groupHeader").should("contain.text", expectedGroupDate)
      cy.get("@groupHeader").should("contain.text", "Exceptions Resolved: 0")
      cy.get("@groupHeader").should("contain.text", "Triggers Resolved: 0")
      cy.get("@groupHeader").should("contain.text", "Exceptions/Triggers Locked: 0")

      cy.get(".report-container > section").eq(index).find("tbody tr").should("have.length", 0)
    })
  })
})
