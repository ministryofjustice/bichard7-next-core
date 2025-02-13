import { loginAndVisit } from "../../support/helpers"

describe("Refresh button", () => {
  beforeEach(() => {
    cy.task("clearCourtCases")
  })

  it("with no cases it will be present at top and not at bottom", () => {
    loginAndVisit()

    cy.get(".top-refresh-container button").should("exist")
    cy.get(".bottom-refresh-container button").should("not.exist")
  })

  it("will refresh the page when clicked", () => {
    loginAndVisit()

    cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "01" }])
    cy.get("tbody tr").should("have.length", 0)

    cy.get(".top-refresh-container button").click()

    cy.url().should("match", /\/bichard$/)
    cy.get("tbody tr").should("have.length", 1)

    cy.get(".bottom-refresh-container button").should("exist")
  })
})
