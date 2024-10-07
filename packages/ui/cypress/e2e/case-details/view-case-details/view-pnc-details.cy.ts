import { loginAndVisit } from "../../../support/helpers"

describe("when viewing case-details sidebar", () => {
  beforeEach(() => {
    cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "01", errorCount: 0 }])
  })

  afterEach(() => {
    cy.task("clearCourtCases")
  })

  it("displays the pnc-details tab", () => {
    loginAndVisit("/bichard/court-cases/0")

    cy.get(".case-details-sidebar #pnc-details").should("exist")
  })

  it("displays pnc-details panel when tab clicked", () => {
    loginAndVisit("/bichard/court-cases/0")

    cy.get("#pnc-details-tab").click()

    cy.get(".case-details-sidebar #pnc-details").should("be.visible")
  })
})
