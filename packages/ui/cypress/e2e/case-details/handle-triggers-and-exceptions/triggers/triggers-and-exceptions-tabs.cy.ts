import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import { caseURL, defaultTriggerCases, mixedTriggers } from "../../../../fixtures/triggers"
import { loginAndVisit } from "../../../../support/helpers"

describe("Triggers and exceptions tabs", () => {
  before(() => {
    cy.task("clearTriggers")
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", defaultTriggerCases)
  })

  it("should show neither triggers nor exceptions to a user with no groups", () => {
    loginAndVisit("NoGroups", caseURL)

    cy.get(".case-details-sidebar #triggers-tab").should("not.exist")
    cy.get(".case-details-sidebar #triggers-tab-panel").should("not.exist")

    cy.get(".case-details-sidebar #exceptions-tab").should("not.exist")
    cy.get(".case-details-sidebar #exceptions-tab-panel").should("not.exist")
  })

  it("should only show triggers to Trigger Handlers", () => {
    cy.task("insertTriggers", {
      caseId: 0,
      triggers: [
        {
          triggerId: 0,
          triggerCode: TriggerCode.TRPR0001,
          status: "Resolved",
          createdAt: new Date("2022-07-09T10:22:34.000Z")
        }
      ]
    })
    loginAndVisit("TriggerHandler", caseURL)

    cy.get(".case-details-sidebar #triggers-tab").should("exist")
    cy.get(".case-details-sidebar #triggers-tab-panel").should("exist")
    cy.get(".case-details-sidebar #triggers-tab-panel").should("be.visible")

    cy.get(".case-details-sidebar #exceptions-tab").should("not.exist")
    cy.get(".case-details-sidebar #exceptions-tab-panel").should("not.exist")
  })

  it("should only show exceptions to Exception Handlers", () => {
    loginAndVisit("ExceptionHandler", caseURL)

    cy.get(".case-details-sidebar #triggers-tab").should("not.exist")
    cy.get(".case-details-sidebar #triggers-tab-panel").should("not.exist")

    cy.get(".case-details-sidebar #exceptions-tab").should("exist")
    cy.get(".case-details-sidebar #exceptions-tab-panel").should("exist")
    cy.get(".case-details-sidebar #exceptions-tab-panel").should("be.visible")
  })

  it("should show both trigger and exceptions to General Handlers with triggers tab selected", () => {
    cy.task("insertTriggers", { caseId: 0, triggers: mixedTriggers })
    loginAndVisit("GeneralHandler", caseURL)

    cy.get(".case-details-sidebar #triggers-tab").should("exist")
    cy.get(".case-details-sidebar #triggers-tab-panel").should("exist")
    cy.get(".case-details-sidebar #triggers-tab-panel").should("be.visible")

    cy.get(".case-details-sidebar #exceptions-tab").should("exist")
    cy.get(".case-details-sidebar #exceptions-tab-panel").should("exist")
    cy.get(".case-details-sidebar #exceptions-tab-panel").should("not.be.visible")
  })

  it("should select exceptions tab by default when there aren't any triggers", () => {
    cy.task("clearTriggers")
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        errorLockedByUsername: null,
        triggerLockedByUsername: null,
        orgForPoliceFilter: "01"
      }
    ])

    loginAndVisit("GeneralHandler", caseURL)

    cy.get(".case-details-sidebar #triggers-tab").should("exist")
    cy.get(".case-details-sidebar #triggers-tab-panel").should("exist")
    cy.get(".case-details-sidebar #triggers-tab-panel").should("not.be.visible")

    cy.get(".case-details-sidebar #exceptions-tab").should("exist")
    cy.get(".case-details-sidebar #exceptions-tab-panel").should("exist")
    cy.get(".case-details-sidebar #exceptions-tab-panel").should("be.visible")
  })

  it("will refresh CSRF token when clicking Trigger tab", () => {
    cy.task("clearTriggers")
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        errorLockedByUsername: null,
        triggerLockedByUsername: null,
        orgForPoliceFilter: "01"
      }
    ])

    loginAndVisit("GeneralHandler", caseURL)

    cy.get(".case-details-sidebar #triggers-tab").should("exist")

    cy.intercept("GET", `/bichard/api/refresh-csrf-token`).as("csrfToken")

    cy.get(".case-details-sidebar #triggers-tab").click()

    cy.wait("@csrfToken")

    const regex = new RegExp("CSRFToken%2Fapi%2Frefresh-csrf-token=")
    cy.get("@csrfToken").its("response.body.csrfToken").should("match", regex)
  })
})
