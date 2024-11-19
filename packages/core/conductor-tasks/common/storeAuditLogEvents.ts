import type { ConductorWorker } from "@io-orkes/conductor-javascript"
import type Task from "@moj-bichard7/common/conductor/types/Task"

import completed from "@moj-bichard7/common/conductor/helpers/completed"
import failed from "@moj-bichard7/common/conductor/helpers/failed"
import inputDataValidator from "@moj-bichard7/common/conductor/middleware/inputDataValidator"
import { auditLogEventSchema } from "@moj-bichard7/common/schemas/auditLogEvent"
import { isError } from "@moj-bichard7/common/types/Result"
import logger from "@moj-bichard7/common/utils/logger"
import axios from "axios"
import { z } from "zod"

const inputDataSchema = z.object({
  auditLogEvents: z.array(auditLogEventSchema),
  correlationId: z.string()
})
type InputData = z.infer<typeof inputDataSchema>

const storeAuditLogEvents: ConductorWorker = {
  execute: inputDataValidator(inputDataSchema, async (task: Task<InputData>) => {
    const auditLogApiUrl = process.env.AUDIT_LOG_API_URL
    const auditLogApiKey = process.env.AUDIT_LOG_API_KEY

    if (!auditLogApiUrl || !auditLogApiKey) {
      throw new Error("AUDIT_LOG_API_URL and AUDIT_LOG_API_KEY environment variables must be set")
    }

    const { auditLogEvents, correlationId } = task.inputData

    if (auditLogEvents.length > 0) {
      const result = await axios
        .post(`${auditLogApiUrl}/messages/${correlationId}/events`, auditLogEvents, {
          headers: { "X-Api-Key": auditLogApiKey },
          transformResponse: (x) => x
        })
        .then(() => {
          auditLogEvents.forEach((event) => {
            logger.info({
              correlationId,
              eventCode: event.eventCode,
              eventType: event.eventType,
              message: "Audit Log event created"
            })
          })
        })
        .catch((e) => e as Error)

      if (isError(result)) {
        return failed(result.message)
      }
    }

    return completed(`${auditLogEvents.length} audit log events written to API`)
  }),
  taskDefName: "store_audit_log_events"
}

export default storeAuditLogEvents
