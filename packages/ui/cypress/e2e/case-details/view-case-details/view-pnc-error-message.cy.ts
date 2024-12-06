import { loginAndVisit } from "../../../support/helpers"

describe("View PNC Error Message", () => {

  before(() => {
    loginAndVisit("Supervisor")
  })

  beforeEach(() => {
    cy.task("clearCourtCases")
  })

  it("displays the PNC error message in the dropdown on the Exceptions tab", () => {
    cy.task("insertCourtCaseWithPncException", {
      exceptions: {
        pncExceptionCode: "HO100402",
        pncExceptionMessage: "I1008 - GWAY - ENQUIRY ERROR NO SUITABLE DISPOSAL GROUPS 20/01JP/01/5151Y"
      },
      case: {
        errorLockedByUsername: null,
        triggerLockedByUsername: null,
        orgForPoliceFilter: "01"
      }
    })
    cy.contains("NAME Defendant").should("be.visible").click()

    cy.get("#exceptions-tab").should("be.visible").click()
    cy.contains("PNC error message").should("be.visible").click()

    cy.contains("I1008 - GWAY - ENQUIRY ERROR NO SUITABLE DISPOSAL GROUPS 20/01JP/01/5151Y").should("be.visible")
  })
})
