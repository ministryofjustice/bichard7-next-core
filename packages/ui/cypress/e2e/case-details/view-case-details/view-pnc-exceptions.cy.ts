import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import { loginAndVisit } from "../../../support/helpers"

describe("Render PNC exception and View PNC Error Message", () => {
  const exceptionCodeMap: { [key in ExceptionCode]?: string } = {
    [ExceptionCode.HO100301]: "I0013 - TEST ERROR MESSAGE",
    [ExceptionCode.HO100302]: "PNCAM - TEST ERROR MESSAGE",
    [ExceptionCode.HO100313]: "I0208 - TEST ERROR MESSAGE",
    [ExceptionCode.HO100314]: "I0007 - TEST ERROR MESSAGE",
    [ExceptionCode.HO100315]: "I5001 - TEST ERROR MESSAGE",
    [ExceptionCode.HO100401]: "I0034 - TEST ERROR MESSAGE",
    [ExceptionCode.HO100402]: "I0001 - TEST ERROR MESSAGE",
    [ExceptionCode.HO100403]: "I5001 - TEST ERROR MESSAGE",
    [ExceptionCode.HO100404]: "I6001 - TEST ERROR MESSAGE"
  }

  beforeEach(() => {
    cy.task("clearCourtCases")
    loginAndVisit("Supervisor")
  })

  Object.entries(exceptionCodeMap).forEach(([exceptionCode, expectedMessage]) => {
    it(`displays the PNC error message for ${exceptionCode} in the dropdown on the Exceptions tab`, () => {
      cy.task("insertCourtCaseWithPncException", {
        exceptions: {
          pncExceptionCode: exceptionCode as ExceptionCode,
          pncExceptionMessage: expectedMessage
        },
        case: {
          errorLockedByUsername: null,
          triggerLockedByUsername: null,
          orgForPoliceFilter: "01"
        }
      })
      cy.visit("/bichard/court-cases/0")

      cy.get("#exceptions-tab").click()
      cy.contains(exceptionCode)
      cy.contains("PNC error message").click()

      cy.contains(expectedMessage).should("be.visible")
    })
  })
})
