import type { CaseDetailsTab } from "types/CaseDetailsTab"
import AsnExceptionHO100206 from "../../../../test/test-data/HO100206.json"
import { clickTab, loginAndVisit } from "../../../support/helpers"

const testFn = (tab: string) => {
  cy.intercept("GET", `/bichard/api/refresh-csrf-token`).as("csrfToken")

  clickTab(tab as CaseDetailsTab)

  cy.wait("@csrfToken")

  const regex = new RegExp("CSRFToken%2Fapi%2Frefresh-csrf-token=")
  cy.get("@csrfToken").its("response.body.csrfToken").should("match", regex)
}

describe("tabs", () => {
  beforeEach(() => {
    cy.task("clearCourtCases")
    cy.task("insertCourtCasesWithFields", [
      {
        orgForPoliceFilter: "01",
        hearingOutcome: AsnExceptionHO100206.hearingOutcomeXml,
        updatedHearingOutcome: AsnExceptionHO100206.hearingOutcomeXml,
        errorCount: 1,
        errorLockedByUsername: "GeneralHandler"
      }
    ])
  })

  describe("refreshes the CSRF token when click on Tab", () => {
    ;["Hearing", "Case", "Offences", "Notes"].forEach((tab) => {
      it(tab, () => {
        loginAndVisit("/bichard/court-cases/0")

        testFn(tab)
      })
    })

    // This is the default tab. We need to move away from it first before we can test it.
    it("Defendant", () => {
      loginAndVisit("/bichard/court-cases/0")

      clickTab("Hearing")

      testFn("Defendant")
    })
  })
})
