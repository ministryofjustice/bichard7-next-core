import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import { loginAndVisit } from "../../../support/helpers"

describe("View PNC Error Message", () => {
  const exceptionCodeMap: { [key in ExceptionCode]?: string } = {
    [ExceptionCode.HO100301]: "I1008 - GWAY - ENQUIRY ERROR ARREST/SUMMONS REF (11/01ZD/01/410843C) NOT FOUND",
    [ExceptionCode.HO100302]: "I1008 - PNCAM - CONNECTION FAILURE AFTER 3 ATTEMPTS.",
    [ExceptionCode.HO100313]: "I0208 - PNC Query returned a business error",
    [ExceptionCode.HO100314]: "I0007 - PNC Query returned a system fault",
    [ExceptionCode.HO100315]: "I5001 - PNC Query returned a warning",
    [ExceptionCode.HO100401]: "I0034 - PNC Query returned a business error",
    [ExceptionCode.HO100402]:
      "I0001 - THE FOLLOWING ELEMENT(S) IN THE DIS SEGMENT CONTAIN INVALID DATA: DISPOSAL TYPE , DISPOSAL QUANTITY",
    [ExceptionCode.HO100403]:
      "I5005 - WARNING - REMAND INFORMATION INDICATES THAT THE SUBJECT WAS ON BAIL AT THE TIME OFFENCE 000 ENTERED FOR ARREST/SUMMONS 24/0000/00/0000000G ON RECORD PNCID/CHECKNAME: 24/000000M XXXXXXX WAS COMMITTED - CHECK DETAILS AND AMEND RECORD AS NECESSARY",
    [ExceptionCode.HO100404]: "PNCUE - PNCUE PNC update communication failed"
  }

  before(() => {
    loginAndVisit("Supervisor")
  })

  beforeEach(() => {
    cy.task("clearCourtCases")
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
      cy.contains("NAME Defendant").should("be.visible").click()

      cy.get("#exceptions-tab").click()
      cy.contains("PNC error message").click()

      cy.contains(expectedMessage).should("be.visible")
    })
  })
})
//   it(`displays the PNC error message for Exception Code HO100301 in the dropdown on the Exceptions tab`, () => {
//     cy.task("insertCourtCaseWithPncException", {
//       exceptions: {
//         pncExceptionCode: ExceptionCode.HO100301,
//         pncExceptionMessage: exceptionCodeMap[ExceptionCode.HO100301]
//       },
//       case: {
//         errorLockedByUsername: null,
//         triggerLockedByUsername: null,
//         orgForPoliceFilter: "01"
//       }
//     })
//     cy.contains("NAME Defendant").should("be.visible").click()

//     cy.get("#exceptions-tab").click()
//     cy.contains("PNC error message").click()

//     cy.contains(exceptionCodeMap[ExceptionCode.HO100301] as string).should("be.visible")
//   })
// })
