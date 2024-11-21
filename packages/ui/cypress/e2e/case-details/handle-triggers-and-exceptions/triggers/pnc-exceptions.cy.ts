import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

import { caseURL } from "../../../../fixtures/triggers"
import { loginAndVisit } from "../../../../support/helpers"

describe("PNC Exceptions", () => {
  before(() => {
    cy.task("clearTriggers")
    cy.task("clearCourtCases")
  })

  it("should render PNC exception and correctly display the PNC error message", () => {
    cy.task("insertCourtCaseWithPncException", {
      case: {
        errorLockedByUsername: null,
        orgForPoliceFilter: "01",
        triggerLockedByUsername: null
      },
      exceptions: {
        pncExceptionCode: "HO100402",
        pncExceptionMessage: "I1008 - GWAY - ENQUIRY ERROR NO SUITABLE DISPOSAL GROUPS 20/01JP/01/5151Y"
      }
    })

    loginAndVisit("GeneralHandler", caseURL)

    cy.get(".case-details-sidebar #exceptions-tab").should("exist")
    cy.get(".case-details-sidebar #exceptions").should("exist")
    cy.get(".case-details-sidebar #exceptions").should("be.visible")
    cy.get(".case-details-sidebar #exceptions .moj-badge").should("have.text", "PNC Error")
    cy.get(".b7-accordion__button").should("have.text", "PNC error message").click()
    cy.get(".accordion__content .b7-inset-text__content").should(
      "have.text",
      "Create DH page on PNC, then Submit the case on Bichard 7"
    )
  })

  it("should render PNC exception and not display the PNC error message accordion when message is empty", () => {
    cy.task("insertCourtCaseWithPncException", {
      case: {
        errorLockedByUsername: null,
        orgForPoliceFilter: "01",
        triggerLockedByUsername: null
      },
      exceptions: {
        pncExceptionCode: "HO100402"
      }
    })

    loginAndVisit("GeneralHandler", caseURL)

    cy.get(".case-details-sidebar #exceptions-tab").should("exist")
    cy.get(".case-details-sidebar #exceptions").should("exist")
    cy.get(".case-details-sidebar #exceptions").should("be.visible")
    cy.get(".case-details-sidebar #exceptions .moj-badge").should("have.text", "PNC Error")
    cy.get(".b7-accordion").should("not.exist")
  })

  it("should render PNC exception on top of the exceptions list", () => {
    cy.task("insertCourtCaseWithPncException", {
      case: {
        errorLockedByUsername: null,
        orgForPoliceFilter: "01",
        triggerLockedByUsername: null
      },
      exceptions: {
        ho100108: true,
        ho100332: true,
        pncExceptionCode: ExceptionCode.HO100302,
        pncExceptionMessage: "I1008 - GWAY - ENQUIRY ERROR MORE THAN 3 DISPOSAL GROUPS 09/0000/00/20004H"
      }
    })

    loginAndVisit("GeneralHandler", caseURL)

    cy.get(".case-details-sidebar #exceptions-tab").should("exist")
    cy.get(".case-details-sidebar #exceptions").should("exist")
    cy.get(".case-details-sidebar #exceptions").should("be.visible")
    cy.get("#exceptions .moj-exception-row").eq(0).find(".moj-badge").should("have.text", "PNC Error")
    cy.get("#exceptions .moj-exception-row").eq(1).should("contain.text", "HO100332 - Offences match more than one CCR")
    cy.get("#exceptions .moj-exception-row").eq(2).should("contain.text", "HO100108")
  })
})
