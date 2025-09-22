import { QualityStatusCard } from "features/CourtCaseDetails/Sidebar/Audit/QualityStatusCard"
import { CsrfTokenContext } from "context/CsrfTokenContext"
import { CourtCaseContext } from "context/CourtCaseContext"
import type { DisplayFullCourtCase } from "types/display/CourtCases"
import { MockNextRouter } from "../../support/MockNextRouter"
import "../../../styles/globals.scss"

const courtCase = {
  errorId: 1
} as unknown as DisplayFullCourtCase

describe("QualityStatusCard", () => {
  it("mounts", () => {
    cy.mount(
      <CsrfTokenContext.Provider value={[{ csrfToken: "ABC" }, () => {}]}>
        <QualityStatusCard />
      </CsrfTokenContext.Provider>
    )
  })

  it("posts form content to the correct URL", () => {
    cy.intercept("POST", `${Cypress.config("baseUrl")}/bichard/api/court-cases/${courtCase.errorId}/audit`).as(
      "auditCase"
    )

    cy.mount(
      <MockNextRouter>
        <CourtCaseContext.Provider value={[{ courtCase, amendments: {}, savedAmendments: {} }, () => {}]}>
          <CsrfTokenContext.Provider value={[{ csrfToken: "ABC" }, () => {}]}>
            <QualityStatusCard />
          </CsrfTokenContext.Provider>
        </CourtCaseContext.Provider>
      </MockNextRouter>
    )

    cy.get("#quality-status-submit").click()
    cy.wait("@auditCase").then((interception) => {
      expect(interception.request.method).to.equal("POST")
    })
  })
})
