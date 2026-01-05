import canManuallyResolveAndSubmitTestData from "../../../fixtures/canManuallyResolveAndSubmitTestData.json"
import { loginAndVisit } from "../../../support/helpers"
import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import type { TestTrigger } from "../../../../test/utils/manageTriggers"

describe("Exception permissions", () => {
  beforeEach(() => {
    cy.task("clearCourtCases")
  })

  canManuallyResolveAndSubmitTestData.forEach(
    ({ canManuallyResolveAndSubmit, exceptionStatus, exceptionLockedByAnotherUser, loggedInAs }) => {
      it(`${loggedInAs} should ${
        canManuallyResolveAndSubmit ? "be able to resolve or submit" : "NOT be able to resolve or submit"
      } when exceptions are ${exceptionStatus}, ${
        exceptionLockedByAnotherUser ? "locked by another user" : "locked by current user"
      }`, () => {
        cy.task("insertCourtCasesWithFields", [
          {
            orgForPoliceFilter: "01",
            errorCount: 1,
            errorStatus: exceptionStatus,
            errorResolvedBy: exceptionStatus === "Resolved" ? loggedInAs : undefined,
            errorLockedByUsername: exceptionLockedByAnotherUser ? "BichardForce03" : loggedInAs
          }
        ])
        cy.task("insertTriggers", {
          caseId: 0,
          triggers: [
            {
              triggerId: 1,
              triggerCode: TriggerCode.TRPR0001,
              status: "Unresolved",
              createdAt: new Date()
            } satisfies TestTrigger
          ]
        })
        loginAndVisit(loggedInAs, "/bichard/court-cases/0")

        if (loggedInAs === "GeneralHandler") {
          cy.get(".case-details-sidebar #exceptions-tab").click()
        }

        if (canManuallyResolveAndSubmit) {
          cy.get("a").contains("Mark as manually resolved").should("exist")
          cy.get("button").contains("Submit exception(s)").should("exist")
        } else {
          cy.get("button").contains("Mark as manually resolved").should("not.exist")
          cy.get("button").contains("Submit exception(s)").should("not.exist")
        }

        cy.request({
          failOnStatusCode: false,
          url: "/bichard/court-cases/0/resolve"
        }).then((response) => {
          expect(response.status).to.eq(canManuallyResolveAndSubmit ? 200 : 403)
        })
      })
    }
  )
})
