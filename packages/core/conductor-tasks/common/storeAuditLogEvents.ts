import type { ConductorWorker } from "@io-orkes/conductor-javascript"
import type Task from "@moj-bichard7/common/conductor/types/Task"

import AuditLogApiClient from "@moj-bichard7/common/AuditLogApiClient/AuditLogApiClient"
import createApiConfig from "@moj-bichard7/common/AuditLogApiClient/createApiConfig"
import completed from "@moj-bichard7/common/conductor/helpers/completed"
import failed from "@moj-bichard7/common/conductor/helpers/failed"
import inputDataValidator from "@moj-bichard7/common/conductor/middleware/inputDataValidator"
import { auditLogEventSchema } from "@moj-bichard7/common/schemas/auditLogEvent"
import { isError } from "@moj-bichard7/common/types/Result"
import logger from "@moj-bichard7/common/utils/logger"
import { z } from "zod"

const inputDataSchema = z.object({
  correlationId: z.string(),
  auditLogEvents: z.array(auditLogEventSchema)
})
type InputData = z.infer<typeof inputDataSchema>

const storeAuditLogEvents: ConductorWorker = {
  taskDefName: "store_audit_log_events",
  execute: inputDataValidator(inputDataSchema, async (task: Task<InputData>) => {
    const { correlationId, auditLogEvents } = task.inputData

    const { apiKey, apiUrl, basePath } = createApiConfig()
    const apiClient = new AuditLogApiClient(apiUrl, apiKey, 30_000, basePath)

    if (auditLogEvents.length > 0) {
      const result = await apiClient.createEvents(correlationId, auditLogEvents)

      if (isError(result)) {
        return failed(result.message)
      }

      auditLogEvents.forEach((event) => {
        logger.info({
          message: "Audit Log event created",
          correlationId,
          eventCode: event.eventCode,
          eventType: event.eventType
        })
      })
    }

    return completed(`${auditLogEvents.length} audit log events written to API`)
  })
}

export default storeAuditLogEvents
