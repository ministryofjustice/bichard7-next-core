import { CourtCaseContext } from "context/CourtCaseContext"
import { CsrfTokenContext } from "context/CsrfTokenContext"
import { QualityStatusDisplay } from "features/CourtCaseDetails/Sidebar/Audit/QualityStatusDisplay"
import type { DisplayFullCourtCase } from "types/display/CourtCases"
import "../../../styles/globals.scss"
import { MockNextRouter } from "../../support/MockNextRouter"

const courtCase = {
  errorId: 1,
  triggerQualityChecked: null,
  errorQualityChecked: null,
  aho: {
    Exceptions: ["HO100301"]
  },
  triggerCount: 1
} as unknown as DisplayFullCourtCase

const newCourtCase = {
  ...courtCase,
  triggerQualityChecked: 2,
  errorQualityChecked: 6
} as unknown as DisplayFullCourtCase

describe("QualityStatusDisplay", () => {
  it("mounts", () => {
    cy.mount(
      <MockNextRouter>
        <CourtCaseContext.Provider value={[{ courtCase, amendments: {}, savedAmendments: {} }, () => {}]}>
          <CsrfTokenContext.Provider value={[{ csrfToken: "ABC" }, () => {}]}>
            <QualityStatusDisplay hasExceptions={true} hasTriggers={true} />
          </CsrfTokenContext.Provider>
        </CourtCaseContext.Provider>
      </MockNextRouter>
    )
  })

  it("does not render trigger or exception values when the case has no triggers or exceptions", () => {
    cy.mount(
      <MockNextRouter>
        <CourtCaseContext.Provider value={[{ courtCase, amendments: {}, savedAmendments: {} }, () => {}]}>
          <CsrfTokenContext.Provider value={[{ csrfToken: "ABC" }, () => {}]}>
            <QualityStatusDisplay hasExceptions={false} hasTriggers={false} />
          </CsrfTokenContext.Provider>
        </CourtCaseContext.Provider>
      </MockNextRouter>
    )

    cy.get(".govuk-summary-list__row").should("not.exist")
    cy.get(".govuk-summary-list__value").should("not.exist")
  })

  it("displays trigger and exception values when the case has triggers and exceptions", () => {
    cy.mount(
      <MockNextRouter>
        <CourtCaseContext.Provider value={[{ courtCase, amendments: {}, savedAmendments: {} }, () => {}]}>
          <CsrfTokenContext.Provider value={[{ csrfToken: "ABC" }, () => {}]}>
            <QualityStatusDisplay hasExceptions={true} hasTriggers={true} />
          </CsrfTokenContext.Provider>
        </CourtCaseContext.Provider>
      </MockNextRouter>
    )

    cy.get(".govuk-summary-list__row").should("exist")
    cy.get(".govuk-summary-list__row").contains("Trigger Quality: ").should("be.visible")
    cy.get(".govuk-summary-list__row").contains("Exception Quality: ").should("be.visible")
  })

  it("allows display of exception quality only", () => {
    cy.mount(
      <MockNextRouter>
        <CourtCaseContext.Provider value={[{ courtCase, amendments: {}, savedAmendments: {} }, () => {}]}>
          <CsrfTokenContext.Provider value={[{ csrfToken: "ABC" }, () => {}]}>
            <QualityStatusDisplay hasExceptions={true} hasTriggers={false} />
          </CsrfTokenContext.Provider>
        </CourtCaseContext.Provider>
      </MockNextRouter>
    )

    cy.get(".govuk-summary-list__row").should("exist")
    cy.get(".govuk-summary-list__row").contains("Exception Quality: ").should("be.visible")
    cy.get(".govuk-summary-list__value").contains("Not Checked").should("be.visible")
  })

  it("allows display of trigger quality only", () => {
    cy.mount(
      <MockNextRouter>
        <CourtCaseContext.Provider value={[{ courtCase, amendments: {}, savedAmendments: {} }, () => {}]}>
          <CsrfTokenContext.Provider value={[{ csrfToken: "ABC" }, () => {}]}>
            <QualityStatusDisplay hasExceptions={false} hasTriggers={true} />
          </CsrfTokenContext.Provider>
        </CourtCaseContext.Provider>
      </MockNextRouter>
    )

    cy.get(".govuk-summary-list__row").should("exist")
    cy.get(".govuk-summary-list__row").contains("Trigger Quality: ").should("be.visible")
    cy.get(".govuk-summary-list__value").contains("Not Checked").should("be.visible")
  })

  it("renders trigger quality if set", () => {
    cy.mount(
      <MockNextRouter>
        <CourtCaseContext.Provider
          value={[
            {
              courtCase: {
                ...courtCase,
                triggerQualityChecked: newCourtCase.triggerQualityChecked
              },
              amendments: {},
              savedAmendments: {}
            },
            () => {}
          ]}
        >
          <CsrfTokenContext.Provider value={[{ csrfToken: "ABC" }, () => {}]}>
            <QualityStatusDisplay hasExceptions={false} hasTriggers={true} />
          </CsrfTokenContext.Provider>
        </CourtCaseContext.Provider>
      </MockNextRouter>
    )

    cy.get(".govuk-summary-list__row").should("exist")
    cy.get(".govuk-summary-list__row").contains("Trigger Quality: ").should("be.visible")
    cy.get(".govuk-summary-list__value").contains("Pass").should("be.visible")
  })

  it("renders exception value if set", () => {
    cy.mount(
      <MockNextRouter>
        <CourtCaseContext.Provider
          value={[
            {
              courtCase: {
                ...courtCase,
                errorQualityChecked: newCourtCase.errorQualityChecked
              },
              amendments: {},
              savedAmendments: {}
            },
            () => {}
          ]}
        >
          <CsrfTokenContext.Provider value={[{ csrfToken: "ABC" }, () => {}]}>
            <QualityStatusDisplay hasExceptions={true} hasTriggers={false} />
          </CsrfTokenContext.Provider>
        </CourtCaseContext.Provider>
      </MockNextRouter>
    )

    cy.get(".govuk-summary-list__row").should("exist")
    cy.get(".govuk-summary-list__row").contains("Exception Quality: ").should("be.visible")
    cy.get(".govuk-summary-list__value").contains("Manual Disposal Fail").should("be.visible")
  })
})
