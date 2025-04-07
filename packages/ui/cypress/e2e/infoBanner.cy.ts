import HO100206 from "../../test/test-data/HO100206.json"
import { loginAndVisit } from "../support/helpers"

describe("infoBanner", () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.sessionStorage.clear()
    })
  })

  it("appears when page loads", () => {
    loginAndVisit()

    cy.get(".info-banner").should("exist")
  })

  it("disappears when closed and does not reappear on a page refresh", () => {
    loginAndVisit()

    cy.get(".info-banner").should("exist")

    cy.get(".info-banner__close").click()
    cy.get(".info-banner").should("not.exist")

    cy.reload()
    cy.get(".info-banner").should("not.exist")
  })

  it("persists when navigating through different pages", () => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: HO100206.hearingOutcomeXml,
        updatedHearingOutcome: HO100206.hearingOutcomeXml,
        errorCount: 1,
        errorLockedByUsername: "GeneralHandler"
      }
    ])

    loginAndVisit()

    cy.get(".info-banner").should("exist")

    cy.visit("/bichard/court-cases/0")
    cy.get(".info-banner").should("exist")

    cy.get("a").contains("Mark as manually resolved").click()
    cy.get(".info-banner").should("exist")
  })

  it("disappears for current session when closed on a case-list page and does not reappear on navigating through different pages", () => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: HO100206.hearingOutcomeXml,
        updatedHearingOutcome: HO100206.hearingOutcomeXml,
        errorCount: 1,
        errorLockedByUsername: "GeneralHandler"
      }
    ])

    loginAndVisit()

    cy.get(".info-banner").should("exist")
    cy.get(".info-banner__close").click()
    cy.get(".info-banner").should("not.exist")

    cy.visit("/bichard/court-cases/0")
    cy.get(".info-banner").should("not.exist")

    cy.get("a").contains("Mark as manually resolved").click()
    cy.get(".info-banner").should("not.exist")
  })

  it("disappears for current session when closed on a case-details page and does not reappear on case-list or any other page", () => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: HO100206.hearingOutcomeXml,
        updatedHearingOutcome: HO100206.hearingOutcomeXml,
        errorCount: 1,
        errorLockedByUsername: "GeneralHandler"
      }
    ])

    loginAndVisit()

    cy.get(".info-banner").should("exist")

    cy.visit("/bichard/court-cases/0")
    cy.get(".info-banner__close").click()
    cy.get(".info-banner").should("not.exist")

    cy.get("a").contains("Mark as manually resolved").click()
    cy.get(".info-banner").should("not.exist")

    cy.get("a").contains("Case list").click()
    cy.get(".info-banner").should("not.exist")
  })
})
