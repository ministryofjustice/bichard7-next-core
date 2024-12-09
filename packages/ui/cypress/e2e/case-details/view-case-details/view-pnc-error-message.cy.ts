import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import { loginAndVisit } from "../../../support/helpers"

describe("View PNC Error Message", () => {
  const exceptionCodeMap: { [key in ExceptionCode]?: string[] } = {
    [ExceptionCode.HO100301]: ["I0013", "I0022"],
    [ExceptionCode.HO100302]: ["PNCAM", "PNCUE"],
    [ExceptionCode.HO100313]: ["I0208", "I0209", "I0212", "I0256"],
    [ExceptionCode.HO100314]: [
      "I0007",
      "I0008",
      "I0014",
      "I0015",
      "I0021",
      "I0023",
      "I0031",
      "I0036",
      "I1001",
      "I1041",
      "I6001",
      "I6002"
    ],
    [ExceptionCode.HO100315]: ["I5001", "I5999"],
    [ExceptionCode.HO100401]: [
      "I0034",
      "I0035",
      "I0036",
      "I0007",
      "I0015",
      "I0023",
      "I0014",
      "I0008",
      "I0021",
      "I0031",
      "I0032",
      "I0033",
      "I0013",
      "I0022",
      "I0208",
      "I0209",
      "I0212",
      "I0256"
    ],
    [ExceptionCode.HO100402]: [
      "I0001",
      "I0002",
      "I0003",
      "I0004",
      "I0005",
      "I0017",
      "I0024",
      "I0030",
      ...Array.from({ length: 41 }, (_, i) => `I10${String(i + 1).padStart(2, "0")}`)
    ],
    [ExceptionCode.HO100403]: [...Array.from({ length: 999 }, (_, i) => `I5${String(i + 1).padStart(3, "0")}`)],
    [ExceptionCode.HO100404]: ["I6001", "I6002", "PNCAM", "PNCUE"]
  }

  beforeEach(() => {
    cy.task("clearCourtCases")
    loginAndVisit("Supervisor")
  })

  Object.entries(exceptionCodeMap).forEach(([exceptionCode, messages]) => {
    if (Array.isArray(messages)) {
      messages.forEach((expectedCode) => {
        it(`displays a PNC error message containing "${expectedCode}" for ${exceptionCode} in the dropdown on the Exceptions tab`, () => {
          cy.task("insertCourtCaseWithPncException", {
            exceptions: {
              pncExceptionCode: exceptionCode,
              pncExceptionMessage: `${expectedCode} - TEST ERROR MESSAGE`
            },
            case: {
              errorLockedByUsername: null,
              triggerLockedByUsername: null,
              orgForPoliceFilter: "01"
            }
          })

          cy.visit("/bichard/court-cases/0")
          cy.get("#exceptions-tab").click()
          cy.contains("PNC error message").click()

          cy.contains(expectedCode).should("be.visible")
        })
      })
    }
  })
})
