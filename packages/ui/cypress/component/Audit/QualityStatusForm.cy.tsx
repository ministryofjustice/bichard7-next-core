import { CourtCaseContext } from "context/CourtCaseContext"
import { CsrfTokenContext } from "context/CsrfTokenContext"
import { QualityStatusForm } from "features/CourtCaseDetails/Sidebar/Audit/QualityStatusForm"
import type { DisplayFullCourtCase } from "types/display/CourtCases"
import "../../../styles/globals.scss"
import { MockNextRouter } from "../../support/MockNextRouter"

const courtCase = {
  errorId: 1,
  triggerQualityChecked: null,
  errorQualityChecked: null
} as unknown as DisplayFullCourtCase

const newCsrfToken = "123"
const newCourtCase = {
  ...courtCase,
  triggerQualityChecked: 2,
  errorQualityChecked: 6
} as unknown as DisplayFullCourtCase

describe("QualityStatusForm", () => {
  it("mounts", () => {
    cy.mount(
      <MockNextRouter>
        <CourtCaseContext.Provider value={[{ courtCase, amendments: {}, savedAmendments: {} }, () => {}]}>
          <CsrfTokenContext.Provider value={[{ csrfToken: "ABC" }, () => {}]}>
            <QualityStatusForm />
          </CsrfTokenContext.Provider>
        </CourtCaseContext.Provider>
      </MockNextRouter>
    )
  })

  it("sends data to the correct URL", () => {
    cy.intercept("POST", `${Cypress.config("baseUrl")}/api/court-cases/${courtCase.errorId}/audit`, {
      delay: 200,
      statusCode: 200,
      body: {
        csrfToken: newCsrfToken,
        courtCase: newCourtCase
      }
    }).as("auditCase")

    cy.mount(
      <MockNextRouter>
        <CourtCaseContext.Provider value={[{ courtCase, amendments: {}, savedAmendments: {} }, () => {}]}>
          <CsrfTokenContext.Provider value={[{ csrfToken: "ABC" }, () => {}]}>
            <QualityStatusForm />
          </CsrfTokenContext.Provider>
        </CourtCaseContext.Provider>
      </MockNextRouter>
    )

    cy.get("select[name='trigger-quality']").select(String(newCourtCase.triggerQualityChecked))
    cy.get("select[name='exception-quality']").select(String(newCourtCase.errorQualityChecked))
    cy.get("textarea[name='quality-status-note']").type("Test notes")
    cy.get("button#quality-status-submit").click()

    cy.wait("@auditCase").then(({ request }) => {
      expect(request.method).to.equal("POST")
      expect(request.body.csrfToken).to.equal("ABC")
      expect(request.body.data.triggerQuality).to.equal(newCourtCase.triggerQualityChecked)
      expect(request.body.data.exceptionQuality).to.equal(newCourtCase.errorQualityChecked)
      expect(request.body.data.note).to.equal("Test notes")
    })

    cy.get("form").should("not.have.attr", "aria-describedby")
  })

  it("updates court case and CSRF token after submit", () => {
    cy.intercept("POST", `${Cypress.config("baseUrl")}/api/court-cases/${courtCase.errorId}/audit`, {
      delay: 200,
      statusCode: 200,
      body: {
        csrfToken: newCsrfToken,
        courtCase: newCourtCase
      }
    }).as("auditCase")

    const updateCourtCaseSpy = cy.spy().as("updateCourtCase")
    const updateCrsfTokenSpy = cy.spy().as("updateCrsfToken")

    cy.mount(
      <MockNextRouter>
        <CourtCaseContext.Provider value={[{ courtCase, amendments: {}, savedAmendments: {} }, updateCourtCaseSpy]}>
          <CsrfTokenContext.Provider value={[{ csrfToken: "ABC" }, updateCrsfTokenSpy]}>
            <QualityStatusForm />
          </CsrfTokenContext.Provider>
        </CourtCaseContext.Provider>
      </MockNextRouter>
    )

    cy.get("select[name='trigger-quality']").select(String(newCourtCase.triggerQualityChecked))
    cy.get("select[name='exception-quality']").select(String(newCourtCase.errorQualityChecked))
    cy.get("textarea[name='quality-status-note']").type("Test notes")
    cy.get("button#quality-status-submit").click()

    cy.wait("@auditCase")
    cy.get("@updateCourtCase")
      .should("have.been.calledOnce")
      .then(() => {
        expect(updateCourtCaseSpy.getCall(0).args[0]()).to.deep.equal({ courtCase: newCourtCase })
      })
    cy.get("@updateCrsfToken")
      .should("have.been.calledOnce")
      .then(() => {
        expect(updateCrsfTokenSpy.getCall(0).args[0]()).to.deep.equal({ csrfToken: newCsrfToken })
      })
  })

  it("correctly disables the button and re-enables it", () => {
    cy.intercept("POST", `${Cypress.config("baseUrl")}/api/court-cases/${courtCase.errorId}/audit`, {
      delay: 200,
      statusCode: 200,
      body: {
        csrfToken: newCsrfToken,
        courtCase: newCourtCase
      }
    }).as("auditCase")

    cy.mount(
      <MockNextRouter>
        <CourtCaseContext.Provider value={[{ courtCase, amendments: {}, savedAmendments: {} }, () => {}]}>
          <CsrfTokenContext.Provider value={[{ csrfToken: "ABC" }, () => {}]}>
            <QualityStatusForm />
          </CsrfTokenContext.Provider>
        </CourtCaseContext.Provider>
      </MockNextRouter>
    )

    cy.get("select[name='trigger-quality']").select(String(newCourtCase.triggerQualityChecked))
    cy.get("select[name='exception-quality']").select(String(newCourtCase.errorQualityChecked))
    cy.get("textarea[name='quality-status-note']").type("Test notes")
    cy.get("button#quality-status-submit").click()

    cy.get("button#quality-status-submit").should("be.disabled")
    cy.wait("@auditCase")
    cy.get("button#quality-status-submit").should("not.be.disabled")
  })

  it("shows validation issues if values not entered", () => {
    cy.intercept("POST", `${Cypress.config("baseUrl")}/bichard/api/court-cases/${courtCase.errorId}/audit`).as(
      "auditCase"
    )

    cy.mount(
      <MockNextRouter>
        <CourtCaseContext.Provider value={[{ courtCase, amendments: {}, savedAmendments: {} }, () => {}]}>
          <CsrfTokenContext.Provider value={[{ csrfToken: "ABC" }, () => {}]}>
            <QualityStatusForm />
          </CsrfTokenContext.Provider>
        </CourtCaseContext.Provider>
      </MockNextRouter>
    )

    cy.get("button#quality-status-submit").click()

    cy.get("#trigger-quality-error").should("be.visible")
    cy.get("#exception-quality-error").should("be.visible")
    cy.get("@auditCase").should("not.exist")
  })

  it("shows error if API call returns an error", () => {
    cy.intercept("POST", `${Cypress.config("baseUrl")}/bichard/api/court-cases/${courtCase.errorId}/audit`, {
      statusCode: 500,
      body: {}
    })

    cy.mount(
      <MockNextRouter>
        <CourtCaseContext.Provider value={[{ courtCase, amendments: {}, savedAmendments: {} }, () => {}]}>
          <CsrfTokenContext.Provider value={[{ csrfToken: "ABC" }, () => {}]}>
            <QualityStatusForm />
          </CsrfTokenContext.Provider>
        </CourtCaseContext.Provider>
      </MockNextRouter>
    )

    cy.get("select[name='trigger-quality']").select("2")
    cy.get("select[name='exception-quality']").select("6")
    cy.get("textarea[name='quality-status-note']").type("Test notes")
    cy.get("button#quality-status-submit").click()

    cy.get("#quality-status-form-error").should("be.visible")
    cy.get("form").should("have.attr", "aria-describedby", "quality-status-form-error")
  })
})
