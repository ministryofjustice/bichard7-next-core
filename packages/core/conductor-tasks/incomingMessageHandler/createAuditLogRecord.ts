import type { ConductorWorker } from "@io-orkes/conductor-javascript"
import AuditLogApiClient from "@moj-bichard7/common/AuditLogApiClient/AuditLogApiClient"
import createApiConfig from "@moj-bichard7/common/AuditLogApiClient/createApiConfig"
import completed from "@moj-bichard7/common/conductor/helpers/completed"
import failed from "@moj-bichard7/common/conductor/helpers/failed"
import inputDataValidator from "@moj-bichard7/common/conductor/middleware/inputDataValidator"
import type Task from "@moj-bichard7/common/conductor/types/Task"
import { auditLogApiRecordInputSchema } from "@moj-bichard7/common/schemas/auditLogRecord"
import AuditLogStatus from "@moj-bichard7/common/types/AuditLogStatus"
import { isError } from "@moj-bichard7/common/types/Result"
import { z } from "zod"

const { apiKey, apiUrl } = createApiConfig()
const apiClient = new AuditLogApiClient(apiUrl, apiKey, 30_000)

const inputDataSchema = z.object({
  auditLogRecord: auditLogApiRecordInputSchema
})
type InputData = z.infer<typeof inputDataSchema>

const createAuditLogRecord: ConductorWorker = {
  taskDefName: "create_audit_log_record",
  execute: inputDataValidator(inputDataSchema, async (task: Task<InputData>) => {
    const { auditLogRecord } = task.inputData

    const apiResult = await apiClient.createAuditLog(auditLogRecord)
    if (isError(apiResult)) {
      return failed("Could not create audit log", apiResult.message)
    }

    if (apiResult.status === AuditLogStatus.duplicate) {
      const outputData = {
        duplicateMessage: "isDuplicate"
      }

      return completed(outputData, `Duplicate message hash identified: ${auditLogRecord.messageHash}`)
    }
    return completed(`Created audit log for message: ${auditLogRecord.messageId}`)
  })
}

export default createAuditLogRecord
