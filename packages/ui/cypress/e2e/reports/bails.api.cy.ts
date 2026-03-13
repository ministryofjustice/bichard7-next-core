import { formatDate, subDays } from "date-fns"
import { loginAndVisit } from "../../support/helpers"
import { TestTrigger } from "../../../test/utils/manageTriggers"
import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"

describe("bails report page", () => {
  beforeEach(() => {
    cy.task("clearCourtCases")
  })

  it("selects all correct queries and runs the test", () => {
    const caseTriggers: Partial<TestTrigger>[] = [
      {
        triggerCode: TriggerCode.TRPR0001,
        status: "Unresolved",
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      },
      {
        triggerCode: TriggerCode.TRPR0010,
        status: "Unresolved",
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      }
    ]

    const caseTriggers2: Partial<TestTrigger>[] = [
      {
        triggerCode: TriggerCode.TRPR0001,
        status: "Unresolved",
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      }
    ]

    cy.task("insertCourtCasesWithFields", [
      {
        triggerLockedByUsername: "GeneralHandler",
        orgForPoliceFilter: "01",
        errorStatus: "Resolved",
        messageReceivedTimestamp: new Date(),
        ptiurn: "Case-Bail",
        defendantName: "Case Bail"
      },
      {
        orgForPoliceFilter: "01",
        messageReceivedTimestamp: new Date(),
        ptiurn: "No-Case",
        defendantName: "No-Case Bail"
      }
    ])
    cy.task("insertTriggers", { caseId: 0, triggers: caseTriggers })
    cy.task("insertTriggers", { caseId: 1, triggers: caseTriggers2 })

    loginAndVisit("Supervisor", "/bichard/report-selection")

    cy.get("#report-select").select("Bail Conditions")
    cy.get("#date-from").type(formatDate(subDays(new Date(), 7), "yyyy-MM-dd"))
    cy.get("#date-to").type(formatDate(new Date(), "yyyy-MM-dd"))

    cy.get("#run-report").click()

    cy.get(".results-area table tbody tr").should("have.length", 1)

    cy.get(".results-area table th").contains("Bail Conditions Imposed")

    cy.get(".results-area table tbody tr td:nth(6)").should("have.text", "Case-Bail")
    cy.get(".results-area table tbody tr").contains("Case Bail")

    cy.get(".results-area table tbody tr").should("not.have.text", "No-Case")
  })
})
