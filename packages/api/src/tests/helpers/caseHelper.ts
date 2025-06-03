import type { Case } from "@moj-bichard7/common/types/Case"

import { randomUUID } from "crypto"

import type End2EndPostgres from "../testGateways/e2ePostgres"

import { testAhoXml } from "./ahoHelper"
import { createMockAuditLog } from "./createMockAuditLogs"

const getDefaultCase = (): Case => ({
  aho: testAhoXml,
  asn: "1901ID0100000006148H",
  courtCode: "ABC",
  courtDate: new Date("2025-05-23"),
  courtName: "Kingston Crown Court",
  courtNameUpper: "KINGSTON CROWN COURT",
  courtReference: "ABC",
  courtRoom: "",
  createdAt: new Date("2025-05-23"),
  defendantName: "Defendant",
  defendantNameUpper: "DEFENDANT",
  errorCount: 1,
  errorId: 1,
  errorInsertedAt: new Date("2025-05-23"),
  errorLockedById: null,
  errorQualityChecked: null,
  errorReason: "",
  errorReport: "HO100304||br7:ArrestSummonsNumber",
  errorResolvedAt: null,
  errorResolvedBy: "",
  errorStatus: 1,
  isUrgent: 1,
  lastPncFailureResubmissionAt: null,
  messageId: randomUUID(),
  messageReceivedAt: new Date("2025-05-23"),
  orgForPoliceFilter: [1],
  phase: 1,
  pncUpdateEnabled: "",
  ptiurn: "00112233",
  resolutionAt: null,
  totalPncFailureResubmissions: 0,
  triggerCount: 1,
  triggerInsertedAt: new Date("2025-05-23"),
  triggerLockedById: null,
  triggerQualityChecked: null,
  triggerReason: "",
  triggerResolvedAt: null,
  triggerResolvedBy: "",
  triggerStatus: 1,
  updatedAho: null,
  userUpdatedFlag: 1
})

export const createCase = async (databaseGateway: End2EndPostgres, overrides: Partial<Case> = {}): Promise<Case> => {
  const caseObj = await databaseGateway.createTestCase({
    ...getDefaultCase(),
    ...overrides
  })

  await createMockAuditLog({ messageId: caseObj.messageId })

  return caseObj
}

export const createCases = async (
  databaseGateway: End2EndPostgres,
  numOfCasesToCreate: number,
  overrides: Record<number, Partial<Case>> = {}
): Promise<Case[]> => {
  return Promise.all(
    Array(numOfCasesToCreate)
      .fill(null)
      .map((_, index) =>
        createCase(databaseGateway, {
          ...getDefaultCase(),
          errorId: index + 1,
          ...(overrides[index + 1] ?? {})
        })
      )
  )
}
