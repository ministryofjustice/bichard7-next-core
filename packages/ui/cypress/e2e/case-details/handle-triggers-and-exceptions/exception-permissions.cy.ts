import canManuallyResolveAndSubmitTestData from "../../../fixtures/canManuallyResolveAndSubmitTestData.json"
import { loginAndVisit } from "../../../support/helpers"

describe("Exception permissions", () => {
  beforeEach(() => {
    cy.task("clearCourtCases")
  })

  canManuallyResolveAndSubmitTestData.forEach(
    ({
      canManuallyResolveAndSubmit,
      exceptionStatus,
      exceptionLockedByAnotherUser,
      loggedInAs,
      exceptionsFeatureFlagEnabled
    }) => {
      it(`Should ${
        canManuallyResolveAndSubmit ? "be able to resolve or submit" : "NOT be able to resolve or submit"
      } when exceptions are ${exceptionStatus}, ${
        exceptionLockedByAnotherUser ? "locked by another user" : "locked by current user"
      } and user is a ${loggedInAs} ${
        !exceptionsFeatureFlagEnabled ? "and exceptions feature flag is disabled" : ""
      }`, () => {
        cy.task("insertCourtCasesWithFields", [
          {
            orgForPoliceFilter: "01",
            errorStatus: exceptionStatus,
            errorLockedByUsername: exceptionLockedByAnotherUser ? "BichardForce03" : loggedInAs
          }
        ])
        loginAndVisit(loggedInAs, "/bichard/court-cases/0")

        if (loggedInAs === "GeneralHandler") {
          cy.get(".case-details-sidebar #exceptions-tab").click()
        }

        if (canManuallyResolveAndSubmit) {
          cy.get("button").contains("Mark as manually resolved").should("exist")
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

export {}
