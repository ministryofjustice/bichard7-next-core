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
    cy.get(".case-details-sidebar #triggers").should("not.exist")

    cy.get(".case-details-sidebar #exceptions-tab").should("not.exist")
    cy.get(".case-details-sidebar #exceptions").should("not.exist")
  })

  it("should only show triggers to Trigger Handlers", () => {
    cy.task("insertTriggers", {
      caseId: 0,
      triggers: [
        {
          createdAt: new Date("2022-07-09T10:22:34.000Z"),
          status: "Resolved",
          triggerCode: TriggerCode.TRPR0001,
          triggerId: 0
        }
      ]
    })
    loginAndVisit("TriggerHandler", caseURL)

    cy.get(".case-details-sidebar #triggers-tab").should("exist")
    cy.get(".case-details-sidebar #triggers").should("exist")
    cy.get(".case-details-sidebar #triggers").should("be.visible")

    cy.get(".case-details-sidebar #exceptions-tab").should("not.exist")
    cy.get(".case-details-sidebar #exceptions").should("not.exist")
  })

  it("should only show exceptions to Exception Handlers", () => {
    loginAndVisit("ExceptionHandler", caseURL)

    cy.get(".case-details-sidebar #triggers-tab").should("not.exist")
    cy.get(".case-details-sidebar #triggers").should("not.exist")

    cy.get(".case-details-sidebar #exceptions-tab").should("exist")
    cy.get(".case-details-sidebar #exceptions").should("exist")
    cy.get(".case-details-sidebar #exceptions").should("be.visible")
  })

  it("should show both trigger and exceptions to General Handlers with triggers tab selected", () => {
    cy.task("insertTriggers", { caseId: 0, triggers: mixedTriggers })
    loginAndVisit("GeneralHandler", caseURL)

    cy.get(".case-details-sidebar #triggers-tab").should("exist")
    cy.get(".case-details-sidebar #triggers").should("exist")
    cy.get(".case-details-sidebar #triggers").should("be.visible")

    cy.get(".case-details-sidebar #exceptions-tab").should("exist")
    cy.get(".case-details-sidebar #exceptions").should("exist")
    cy.get(".case-details-sidebar #exceptions").should("not.be.visible")
  })

  it("should select exceptions tab by default when there aren't any triggers", () => {
    cy.task("clearTriggers")
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        errorLockedByUsername: null,
        orgForPoliceFilter: "01",
        triggerLockedByUsername: null
      }
    ])

    loginAndVisit("GeneralHandler", caseURL)

    cy.get(".case-details-sidebar #triggers-tab").should("exist")
    cy.get(".case-details-sidebar #triggers").should("exist")
    cy.get(".case-details-sidebar #triggers").should("not.be.visible")

    cy.get(".case-details-sidebar #exceptions-tab").should("exist")
    cy.get(".case-details-sidebar #exceptions").should("exist")
    cy.get(".case-details-sidebar #exceptions").should("be.visible")
  })
})
