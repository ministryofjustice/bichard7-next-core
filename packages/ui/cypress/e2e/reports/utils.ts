import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import type { TestTrigger } from "../../../test/utils/manageTriggers"

export const insertSampleCases = () => {
  const bailTrigger: Partial<TestTrigger>[] = [
    {
      triggerCode: TriggerCode.TRPR0010,
      status: "Unresolved",
      createdAt: new Date("2022-07-09T10:22:34.000Z")
    }
  ]

  const domesticViolenceTrigger: Partial<TestTrigger>[] = [
    {
      triggerCode: TriggerCode.TRPR0023,
      status: "Unresolved",
      createdAt: new Date("2022-07-09T10:22:34.000Z")
    }
  ]

  const warrantsTrigger: Partial<TestTrigger>[] = [
    {
      triggerCode: TriggerCode.TRPR0002,
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
      ptiurn: "bail",
      defendantName: "Bail Name"
    },
    {
      orgForPoliceFilter: "01",
      messageReceivedTimestamp: new Date(),
      ptiurn: "domVi",
      defendantName: "DomesticViolence Name"
    },
    {
      orgForPoliceFilter: "01",
      messageReceivedTimestamp: new Date(),
      ptiurn: "warrants",
      defendantName: "Warrants Name"
    },
    {
      orgForPoliceFilter: "01",
      errorStatus: "Resolved",
      triggerStatus: "Resolved",
      errorResolvedBy: "user1",
      triggerResolvedBy: "user2",
      messageReceivedTimestamp: new Date(),
      errorResolvedTimestamp: new Date(),
      triggerResolvedTimestamp: new Date(),
      errorReason: "",
      errorReport: ""
    }
  ])
  cy.task("insertTriggers", { caseId: 0, triggers: bailTrigger })
  cy.task("insertTriggers", { caseId: 1, triggers: domesticViolenceTrigger })
  cy.task("insertTriggers", { caseId: 2, triggers: warrantsTrigger })

  cy.task("insertTriggers", {
    caseId: 3,
    triggers: [
      {
        triggerId: 0,
        triggerCode: TriggerCode.TRPR0001,
        status: "Resolved",
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      }
    ]
  })

  cy.task("insertException", {
    caseId: 3,
    exceptionCode: "HO100322",
    errorReport: "HO100322||ds:OrganisationUnitCode",
    errorStatus: "Resolved"
  })
}
