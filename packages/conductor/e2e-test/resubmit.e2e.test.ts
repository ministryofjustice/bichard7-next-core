import "./helpers/setEnvironmentVariables"

import type { AuditLogApiRecordInput } from "@moj-bichard7/common/types/AuditLogRecord"
import type { CaseRow } from "@moj-bichard7/common/types/Case"

import AuditLogApiClient from "@moj-bichard7/common/AuditLogApiClient/AuditLogApiClient"
import createApiConfig from "@moj-bichard7/common/AuditLogApiClient/createApiConfig"
import createDbConfig from "@moj-bichard7/common/db/createDbConfig"
import { waitForCompletedWorkflow } from "@moj-bichard7/common/test/conductor/waitForCompletedWorkflow"
import { isError } from "@moj-bichard7/common/types/Result"
import { createHash, randomUUID } from "crypto"
import fs from "fs"
import * as path from "node:path"
import postgres from "postgres"

import startWorkflow from "./helpers/startWorkflow"

const { apiKey, apiUrl, basePath } = createApiConfig()
const apiClient = new AuditLogApiClient(apiUrl, apiKey, 30_000, basePath)
const dbConfig = createDbConfig()
const db = postgres(dbConfig)

const setupCase = async (
  messageId: string,
  phase: number = 1,
  errorLockedBy: null | string = "user.name",
  errorStatus: number = 1
): Promise<CaseRow> => {
  const ahoXml = fs
    .readFileSync(path.join(__dirname, "fixtures/AnnotatedHO1-with-exceptions.xml"))
    .toString()
    .replace("CID-8bc6ee0a-46ac-4a0e-b9be-b03e3b041415", messageId)
  const [caseRow] = (await db`
      INSERT INTO br7own.error_list
        (annotated_msg, updated_msg, court_reference, create_ts, error_count, error_report, is_urgent, message_id, msg_received_ts, org_for_police_filter, phase, total_pnc_failure_resubmissions, trigger_count, user_updated_flag, error_status, error_locked_by_id)
      VALUES
        (${ahoXml}, ${ahoXml}, '01ZD0304208', ${new Date()}, 2, 'HO100304', 0, ${messageId}, ${new Date()}, '001', ${phase}, 0, 2, 0, ${errorStatus}, ${errorLockedBy})
      RETURNING *
    `) satisfies CaseRow[]

  const auditLogRecord = {
    caseId: "01ZD0303208",
    createdBy: "test",
    externalCorrelationId: messageId,
    isSanitised: 0,
    messageHash: createHash("sha256").update(randomUUID(), "utf-8").digest("hex"),
    messageId,
    receivedDate: new Date().toISOString()
  } satisfies AuditLogApiRecordInput

  await apiClient.createAuditLog(auditLogRecord)

  return caseRow
}

const startAndCompleteFullResubmit = async (
  messageId: string,
  phaseToWaitFor: 1 | 2,
  autoResubmit: boolean,
  expectedParentStatus: "COMPLETED" | "FAILED" = "COMPLETED"
) => {
  await startWorkflow("resubmit", { autoResubmit, messageId }, messageId)

  await waitForCompletedWorkflow(messageId, expectedParentStatus, undefined, "resubmit")

  if (expectedParentStatus === "COMPLETED") {
    const childWorkflowName = phaseToWaitFor === 1 ? "bichard_phase_1" : "bichard_phase_2"

    await waitForCompletedWorkflow(messageId, "COMPLETED", undefined, childWorkflowName)
  }
}

describe("resubmit", () => {
  beforeEach(async () => {
    await db`TRUNCATE br7own.error_list RESTART IDENTITY CASCADE`
  })

  afterAll(async () => {
    await db.end()
  })

  it("triggers the bichard_phase_1 successfully", async () => {
    const messageId = randomUUID()
    await setupCase(messageId)

    await startAndCompleteFullResubmit(messageId, 1, false, "COMPLETED")

    const caseRows = await db<CaseRow[]>`SELECT * FROM br7own.error_list WHERE message_id = ${messageId}`

    expect(caseRows).toHaveLength(1)
    expect(caseRows[0].error_status).toBe(1)
  })

  it("triggers the bichard_phase_2 successfully", async () => {
    const messageId = randomUUID()
    await setupCase(messageId, 2)

    await startAndCompleteFullResubmit(messageId, 2, false, "COMPLETED")

    const [caseRow] = await db<CaseRow[]>`SELECT * FROM br7own.error_list WHERE message_id = ${messageId}`

    expect(caseRow.phase).toBe(2)
  })

  it("has Audit Logs", async () => {
    const messageId = randomUUID()
    await setupCase(messageId)

    await startAndCompleteFullResubmit(messageId, 1, false, "COMPLETED")

    const auditLogEventCodes = await apiClient.getAuditLog(messageId)

    if (isError(auditLogEventCodes)) {
      throw auditLogEventCodes
    }

    expect(auditLogEventCodes.events.map((e) => e.eventCode)).toContain("exceptions.unlocked")
    expect(auditLogEventCodes.events.map((e) => e.eventCode)).toContain("hearing-outcome.resubmitted-phase-1")
    expect(auditLogEventCodes.events.map((e) => e.eventCode)).toContain("hearing-outcome.received-phase-1")
  })

  describe("with auto resubmit", () => {
    it("successfully runs the resubmit workflow", async () => {
      const messageId = randomUUID()
      await setupCase(messageId, 1, null, 1)

      await startAndCompleteFullResubmit(messageId, 1, true, "COMPLETED")

      const [caseRow] = await db<CaseRow[]>`SELECT * FROM br7own.error_list WHERE message_id = ${messageId}`

      expect(caseRow.total_pnc_failure_resubmissions).toBe(1)
    })

    it("fails to run the resubmit workflow with a case that's locked to a user", async () => {
      const messageId = randomUUID()
      await setupCase(messageId, 1, "user.locked", 1)

      await startAndCompleteFullResubmit(messageId, 1, true, "FAILED")

      const [caseRow] = await db<CaseRow[]>`SELECT * FROM br7own.error_list WHERE message_id = ${messageId}`

      expect(caseRow.error_status).toBe(1)
    })

    it("fails to run the resubmit workflow with a case not unresolved", async () => {
      const messageId = randomUUID()
      await setupCase(messageId, 1, "user.locked", 3)

      await startAndCompleteFullResubmit(messageId, 1, true, "FAILED")

      const [caseRow] = await db<CaseRow[]>`SELECT * FROM br7own.error_list WHERE message_id = ${messageId}`

      expect(caseRow.error_status).toBe(3)
    })
  })
})
