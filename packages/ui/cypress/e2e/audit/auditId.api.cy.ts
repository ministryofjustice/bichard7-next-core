import { loginAndVisit } from "../../support/helpers"
import AsnExceptionHO100206 from "../../../test/test-data/HO100206.json"

describe("/audit/:auditId", () => {
  beforeEach(() => {
    cy.task("clearAudits")
    cy.task("clearCourtCases")

    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: AsnExceptionHO100206.hearingOutcomeXml,
        updatedHearingOutcome: AsnExceptionHO100206.hearingOutcomeXml,
        errorCount: 1,
        errorStatus: "Resolved",
        triggerCount: 1
      },
      {
        orgForPoliceFilter: "01",
        hearingOutcome: AsnExceptionHO100206.hearingOutcomeXml,
        updatedHearingOutcome: AsnExceptionHO100206.hearingOutcomeXml,
        errorCount: 1,
        triggerStatus: "Resolved",
        triggerCount: 1,
        triggerQualityChecked: 2
      }
    ])
    cy.task("insertAudit", {
      overrides: {},
      caseIds: [0, 1],
      username: "Supervisor"
    })
  })

  it("Should open the audit page", () => {
    loginAndVisit("Supervisor", `/bichard/audit/1`)

    cy.location("pathname").should("eq", "/bichard/audit/1")
  })

  it("Should be able to navigate to the case details page", () => {
    loginAndVisit("Supervisor", `/bichard/audit/1`)

    cy.location("pathname").should("eq", "/bichard/audit/1")

    cy.get("a#defendant-name-link-0").click()
    cy.location("pathname").should("eq", "/bichard/court-cases/0")
    cy.location("search").should("eq", `?prev=${encodeURIComponent("/audit/1")}`)
  })

  it("Should redirect to the case list if user is not a supervisor", () => {
    loginAndVisit("GeneralHandler", `/bichard/audit/1`)

    cy.location("pathname").should("eq", "/bichard")
  })

  it("Should go to a not found page", () => {
    cy.loginAs("Supervisor")

    cy.request({
      failOnStatusCode: false,
      url: "/bichard/audit/0"
    }).then((response) => {
      expect(response.status).to.eq(404)
    })
  })

  it("Should show progress", () => {
    loginAndVisit("Supervisor", `/bichard/audit/1`)

    cy.location("pathname").should("eq", "/bichard/audit/1")
    cy.contains("50%")
  })

  it("Should show pagination", () => {
    loginAndVisit("Supervisor", `/bichard/audit/1?pageNum=1&maxPerPage=25`)

    cy.location("pathname").should("eq", "/bichard/audit/1")
    cy.contains("Showing 1 to 2 of 2 cases")
    cy.get("a#defendant-name-link-0").should(
      "have.attr",
      "href",
      `/bichard/court-cases/0?prev=${encodeURIComponent(`/audit/1?pageNum=1&maxPerPage=25`)}`
    )
  })

  it("Should error with invalid maxPerPage", () => {
    cy.loginAs("Supervisor")

    cy.request({
      failOnStatusCode: false,
      url: "/bichard/audit/1?pageNum=1&maxPerPage=1000"
    }).then((response) => {
      expect(response.status).to.eq(500)
    })
  })

  it("Should show order", () => {
    loginAndVisit("Supervisor", `/bichard/audit/1?order=desc&orderBy=courtDate`)

    cy.location("pathname").should("eq", "/bichard/audit/1")
    cy.get("#court-date-sort").should("have.attr", "aria-sort", "descending")
    cy.get("a#defendant-name-link-0").should(
      "have.attr",
      "href",
      `/bichard/court-cases/0?prev=${encodeURIComponent(`/audit/1?order=desc&orderBy=courtDate`)}`
    )
  })
})
