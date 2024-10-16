import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import {
  confirmCaseDisplayed,
  confirmCaseNotDisplayed,
  confirmReasonDisplayed,
  confirmReasonNotDisplayed,
  loginAndVisit
} from "../../support/helpers"

describe("Shows relevant information to a user's role", () => {
  const mixedReasonCases = [
    {
      orgForPoliceFilter: "011111",
      errorId: 0,
      exceptions: [
        {
          code: "HO100310",
          field: "ds:OffenceReasonSequence"
        },
        {
          code: "HO100301",
          field: "ds:OffenceReasonSequence"
        }
      ],
      triggers: []
    },
    {
      orgForPoliceFilter: "011111",
      errorId: 1,
      errorCount: 0,
      errorReason: "",
      exceptions: [],
      triggers: [
        {
          triggerId: 0,
          triggerCode: TriggerCode.TRPR0010,
          status: "Unresolved",
          createdAt: new Date()
        },
        {
          triggerId: 1,
          triggerCode: "TRPR0011",
          status: "Unresolved",
          createdAt: new Date()
        }
      ]
    },
    {
      orgForPoliceFilter: "011111",
      errorId: 2,
      exceptions: [
        {
          code: "HO100310",
          field: "ds:OffenceReasonSequence"
        },
        {
          code: "HO100301",
          field: "ds:OffenceReasonSequence"
        }
      ],
      triggers: [
        {
          triggerId: 2,
          triggerCode: TriggerCode.TRPR0010,
          status: "Unresolved",
          createdAt: new Date()
        },
        {
          triggerId: 3,
          triggerCode: "TRPR0011",
          status: "Unresolved",
          createdAt: new Date()
        }
      ]
    }
  ]

  beforeEach(() => {
    cy.task(
      "insertCourtCasesWithFields",
      mixedReasonCases.map((courtCase) => {
        return {
          errorId: courtCase.errorId,
          orgForPoliceFilter: courtCase.orgForPoliceFilter,
          errorCount: courtCase.errorCount,
          errorReason: courtCase.errorReason
        }
      })
    )
    mixedReasonCases.forEach((courtCase) => {
      courtCase.exceptions?.forEach((exception) => {
        cy.task("insertException", {
          caseId: courtCase.errorId,
          exceptionCode: exception.code,
          errorReport: `${exception.code}||${exception.field}`
        })
      })
      if (courtCase.triggers && courtCase.triggers.length > 0) {
        cy.task("insertTriggers", { caseId: courtCase.errorId, triggers: courtCase.triggers })
      }
    })
  })

  it("Shouldn't show cases to a user with no groups", () => {
    loginAndVisit("NoGroups")

    cy.findByText("There are no court cases to show").should("exist")
  })

  it("Should only show cases with triggers to a trigger handler", () => {
    loginAndVisit("TriggerHandler")

    confirmCaseDisplayed("Case00001")
    confirmCaseDisplayed("Case00002")

    confirmCaseNotDisplayed("Case00000")
  })

  it("Should only show cases with exceptions to an exception handler", () => {
    loginAndVisit("ExceptionHandler")

    confirmCaseDisplayed("Case00000")
    confirmCaseDisplayed("Case00002")

    confirmCaseNotDisplayed("Case00001")
  })

  it("Should show all cases to a general handler", () => {
    loginAndVisit("GeneralHandler")

    confirmCaseDisplayed("Case00000")
    confirmCaseDisplayed("Case00001")
    confirmCaseDisplayed("Case00002")
  })

  it("Should show all cases to a supervisor", () => {
    loginAndVisit("Supervisor")

    confirmCaseDisplayed("Case00000")
    confirmCaseDisplayed("Case00001")
    confirmCaseDisplayed("Case00002")
  })

  it("Should only show triggers in the reason column to a trigger handler", () => {
    loginAndVisit("TriggerHandler")

    confirmReasonDisplayed("PR10")
    confirmReasonDisplayed("PR11")

    confirmReasonNotDisplayed("HO100301")
    confirmReasonNotDisplayed("HO100310")
  })

  it("Should only show exceptions in the reason column to an exception handler", () => {
    loginAndVisit("ExceptionHandler")

    confirmReasonNotDisplayed("PR10")
    confirmReasonNotDisplayed("PR11")

    confirmReasonDisplayed("HO100301")
    confirmReasonDisplayed("HO100310")
  })

  it("Should show both triggers and exceptions in the reason column to a general handler", () => {
    loginAndVisit("GeneralHandler")

    confirmReasonDisplayed("PR10")
    confirmReasonDisplayed("PR11")

    confirmReasonDisplayed("HO100301")
    confirmReasonDisplayed("HO100310")
  })
})
