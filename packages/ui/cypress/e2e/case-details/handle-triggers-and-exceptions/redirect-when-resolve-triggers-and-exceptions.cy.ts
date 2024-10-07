import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import { TestTrigger } from "../../../../test/utils/manageTriggers"
import redirectWhenResolveTriggersAndExceptions from "../../../fixtures/redirectWhenResolveTriggersAndExceptions.json"
import { loginAndVisit } from "../../../support/helpers"

describe("Redirect when resolve triggers and exceptions", () => {
  beforeEach(() => {
    cy.task("clearCourtCases")
  })

  redirectWhenResolveTriggersAndExceptions.forEach(
    ({ loggedInAs, expectedPath, hasExceptions, hasTriggers, resolveExceptions, resolveTriggers }) => {
      it(`Should redirect to ${expectedPath} when user is a ${loggedInAs} and there are ${
        hasExceptions ? "unresolved exceptions" : ""
      } ${hasExceptions && hasTriggers ? "and" : ""} ${hasTriggers ? "unresolved triggers" : ""} and ${loggedInAs} ${
        resolveExceptions ? "resolves exceptions" : ""
      } ${resolveExceptions && resolveTriggers ? "and" : ""} ${resolveTriggers ? "resolves triggers" : ""}`, () => {
        cy.task("clearCourtCases")
        cy.task("insertCourtCasesWithFields", [
          {
            orgForPoliceFilter: "01",
            errorStatus: hasExceptions ? "Unresolved" : null,
            errorCount: hasExceptions ? 1 : 0,
            triggerStatus: hasTriggers ? "Unresolved" : null
          }
        ])

        if (hasTriggers) {
          const caseTriggers: Partial<TestTrigger>[] = [
            {
              triggerCode: TriggerCode.TRPR0001,
              status: "Unresolved",
              createdAt: new Date("2022-07-09T10:22:34.000Z")
            }
          ]
          cy.task("insertTriggers", { caseId: 0, triggers: caseTriggers })
        }

        loginAndVisit(loggedInAs, "/bichard/court-cases/0")

        if (resolveExceptions) {
          if (loggedInAs === "GeneralHandler") {
            cy.get(".case-details-sidebar #exceptions-tab").click()
          }
          cy.get("button").contains("Mark as manually resolved").click()
          cy.get("button").contains("Resolve").click()
        }

        if (resolveTriggers) {
          cy.get("#select-all-triggers button").click()
          cy.get("#mark-triggers-complete-button").click()
        }

        if (expectedPath === "case list page") {
          cy.url().should("match", /\/bichard$/)
        } else if (expectedPath === "case details page") {
          cy.url().should("match", /\/court-cases\/\d+/)
        }
      })
    }
  )
})

export {}
