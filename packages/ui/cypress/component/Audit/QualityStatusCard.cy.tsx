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
      <MockNextRouter>
        <CourtCaseContext.Provider value={[{ courtCase, amendments: {}, savedAmendments: {} }, () => {}]}>
          <CsrfTokenContext.Provider value={[{ csrfToken: "ABC" }, () => {}]}>
            <QualityStatusCard />
          </CsrfTokenContext.Provider>
        </CourtCaseContext.Provider>
      </MockNextRouter>
    )
  })

  it("posts form content to the correct URL", () => {
    cy.intercept("PUT", `${Cypress.config("baseUrl")}/bichard/api/court-cases/${courtCase.errorId}/audit`, {
      delay: 200,
      statusCode: 200,
      body: {}
    }).as("auditCase")

    cy.mount(
      <MockNextRouter>
        <CourtCaseContext.Provider value={[{ courtCase, amendments: {}, savedAmendments: {} }, () => {}]}>
          <CsrfTokenContext.Provider value={[{ csrfToken: "ABC" }, () => {}]}>
            <QualityStatusCard />
          </CsrfTokenContext.Provider>
        </CourtCaseContext.Provider>
      </MockNextRouter>
    )

    cy.get("select[name='trigger-quality']").select("2")
    cy.get("select[name='exception-quality']").select("6")
    cy.get("textarea[name='quality-status-note']").type("Test notes")
    cy.get("button#quality-status-submit").click()
    cy.get("button#quality-status-submit").should("be.disabled")

    cy.wait("@auditCase").then(({ request }) => {
      expect(request.method).to.equal("PUT")
      expect(request.body.csrfToken).to.equal("ABC")
      expect(request.body.data.triggerQuality).to.equal(2)
      expect(request.body.data.exceptionQuality).to.equal(6)
      expect(request.body.data.note).to.equal("Test notes")

      cy.get("button#quality-status-submit").should("not.be.disabled")
    })
  })

  it("show validation issues if values not entered", () => {
    cy.intercept("PUT", `${Cypress.config("baseUrl")}/bichard/api/court-cases/${courtCase.errorId}/audit`).as(
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

    cy.get("button#quality-status-submit").click()

    cy.get("#trigger-quality-error").should("be.visible")
    cy.get("#exception-quality-error").should("be.visible")
    cy.get("@auditCase").should("not.exist")
  })

  it("show error if API call returns an error", () => {
    cy.intercept("PUT", `${Cypress.config("baseUrl")}/bichard/api/court-cases/${courtCase.errorId}/audit`, {
      statusCode: 500,
      body: {}
    })

    cy.mount(
      <MockNextRouter>
        <CourtCaseContext.Provider value={[{ courtCase, amendments: {}, savedAmendments: {} }, () => {}]}>
          <CsrfTokenContext.Provider value={[{ csrfToken: "ABC" }, () => {}]}>
            <QualityStatusCard />
          </CsrfTokenContext.Provider>
        </CourtCaseContext.Provider>
      </MockNextRouter>
    )

    cy.get("select[name='trigger-quality']").select("2")
    cy.get("select[name='exception-quality']").select("6")
    cy.get("textarea[name='quality-status-note']").type("Test notes")
    cy.get("button#quality-status-submit").click()

    cy.get("#quality-status-form-error").should("be.visible")
  })
})
