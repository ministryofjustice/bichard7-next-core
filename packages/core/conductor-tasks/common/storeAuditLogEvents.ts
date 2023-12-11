import type { ConductorWorker } from "@io-orkes/conductor-javascript"
import completed from "@moj-bichard7/common/conductor/helpers/completed"
import failed from "@moj-bichard7/common/conductor/helpers/failed"
import inputDataValidator from "@moj-bichard7/common/conductor/middleware/inputDataValidator"
import type Task from "@moj-bichard7/common/conductor/types/Task"
import { auditLogEventSchema } from "@moj-bichard7/common/schemas/auditLogEvent"
import { isError } from "@moj-bichard7/common/types/Result"
import logger from "@moj-bichard7/common/utils/logger"
import axios from "axios"
import { z } from "zod"

const auditLogApiUrl = process.env.AUDIT_LOG_API_URL
const auditLogApiKey = process.env.AUDIT_LOG_API_KEY

if (!auditLogApiUrl || !auditLogApiKey) {
  throw new Error("AUDIT_LOG_API_URL and AUDIT_LOG_API_KEY environment variables must be set")
}

const inputDataSchema = z.object({
  correlationId: z.string(),
  auditLogEvents: z.array(auditLogEventSchema)
})
type InputData = z.infer<typeof inputDataSchema>

const storeAuditLogEvents: ConductorWorker = {
  taskDefName: "store_audit_log_events",
  execute: inputDataValidator(inputDataSchema, async (task: Task<InputData>) => {
    const { correlationId, auditLogEvents } = task.inputData

    if (auditLogEvents.length > 0) {
      const result = await axios
        .post(`${auditLogApiUrl}/messages/${correlationId}/events`, auditLogEvents, {
          headers: { "X-Api-Key": auditLogApiKey },
          transformResponse: (x) => x
        })
        .then(() => {
          auditLogEvents.forEach((event) => {
            logger.info({
              message: "Audit Log event created",
              correlationId,
              eventCode: event.eventCode,
              eventType: event.eventType
            })
          })
        })
        .catch((e) => e as Error)

      if (isError(result)) {
        return failed(result.message)
      }
    }

    return completed(`${auditLogEvents.length} audit log events written to API`)
  })
}

export default storeAuditLogEvents
