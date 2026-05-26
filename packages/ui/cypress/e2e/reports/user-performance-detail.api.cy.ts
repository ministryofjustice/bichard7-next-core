import { format, subDays } from "date-fns"
import { loginAndVisit } from "../../support/helpers"
import { insertSampleCases } from "./utils"

describe("User Performance Detail", () => {
  beforeEach(() => {
    loginAndVisit("Supervisor", "/bichard/report-selection")
    cy.task("clearCourtCases")
  })

  it("should verify the report structure, headers, row data, and empty past dates", () => {
    insertSampleCases()

    const today = new Date()
    const fromDate = format(subDays(today, 7), "yyyy-MM-dd")
    const toDate = format(today, "yyyy-MM-dd")
    const formattedGroupDate = format(today, "dd/MM/yyyy")

    cy.get("#report-select").select("User performance detail")
    cy.get("#date-from").type(fromDate)
    cy.get("#date-to").type(toDate)
    cy.get("#run-report").click()

    cy.get(".report-container")
      .should("be.visible")
      .within(() => {
        cy.contains("h3", formattedGroupDate).parent("section").as("todayGroup")

        cy.get("@todayGroup").within(() => {
          const expectedTables = [
            { userId: "user1", resolved: "1", locked: "0", type: "exceptions" },
            { userId: "General Handler User", resolved: "1", locked: "0", type: "triggers" },
            { userId: "General Handler User", resolved: "0", locked: "1", type: "triggers" }
          ]

          cy.get("section[aria-labelledby^='inner-group']").each(($section, index) => {
            const expected = expectedTables[index]

            cy.wrap($section).within(() => {
              cy.get(".govuk-table__header").eq(0).should("have.text", "Name")
              cy.get(".govuk-table__header").eq(1).should("have.text", `Number of ${expected.type} resolved today`)
              cy.get(".govuk-table__header").eq(2).should("have.text", `Total number of ${expected.type} still locked`)

              cy.get(".govuk-table__body tr")
                .first()
                .within(() => {
                  cy.get("td").eq(0).should("have.text", expected.userId)
                  cy.get("td").eq(1).should("have.text", expected.resolved)
                  cy.get("td").eq(2).should("have.text", expected.locked)
                })
            })
          })
        })

        for (let i = 1; i < 7; i++) {
          const pastDate = format(subDays(today, i), "dd/MM/yyyy")

          cy.contains("h3", pastDate)
            .parent("section")
            .within(() => {
              cy.get("table").should("not.exist")
              cy.get("[itemid='group-body']:empty").should("exist")
            })
        }
      })
  })

  it("should handle no report data", () => {
    const today = new Date()
    const fromDate = format(subDays(today, 7), "yyyy-MM-dd")
    const toDate = format(today, "yyyy-MM-dd")

    cy.get("#report-select").select("User performance detail")
    cy.get("#date-from").type(fromDate)
    cy.get("#date-to").type(toDate)
    cy.get("#run-report").click()

    cy.get(".report-container").should("be.visible")

    for (let i = 0; i < 7; i++) {
      const pastDate = format(subDays(today, i), "dd/MM/yyyy")

      cy.contains("h3", pastDate)
        .parent("section")
        .within(() => {
          cy.get("table").should("not.exist")
          cy.get("[itemid='group-body']:empty").should("exist")
        })
    }
  })
})
