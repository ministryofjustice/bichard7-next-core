import type { ConductorWorker } from "@io-orkes/conductor-javascript"
import completed from "@moj-bichard7/common/conductor/helpers/completed"
import failed from "@moj-bichard7/common/conductor/helpers/failed"
import s3TaskDataFetcher from "@moj-bichard7/common/conductor/middleware/s3TaskDataFetcher"
import { AuditLogEventSource, auditLogEventLookup, type AuditLogEvent } from "@moj-bichard7/common/types/AuditLogEvent"
import EventCategory from "@moj-bichard7/common/types/EventCategory"
import EventCode from "@moj-bichard7/common/types/EventCode"
import { isError } from "@moj-bichard7/common/types/Result"
import logger from "@moj-bichard7/common/utils/logger"
import connectAndSendMessage from "../../lib/mq/connectAndSendMessage"
import serialiseToXml from "../../lib/serialise/pncUpdateDatasetXml/serialiseToXml"
import { phase2ResultSchema } from "../../phase2/schemas/phase2Result"
import type Phase2Result from "../../phase2/types/Phase2Result"

const mqQueue = process.env.PHASE_3_QUEUE_NAME ?? "PNC_UPDATE_REQUEST_QUEUE"

const sendToPhase3: ConductorWorker = {
  taskDefName: "send_to_phase3",
  execute: s3TaskDataFetcher<Phase2Result>(phase2ResultSchema, async (task) => {
    const { s3TaskData } = task.inputData

    const result = await connectAndSendMessage(mqQueue, serialiseToXml(s3TaskData.outputMessage)).catch(
      (e) => e as Error
    )

    if (isError(result)) {
      logger.error({ message: result.message, stack: result.stack })
      return failed("Failed to write to MQ", result.message)
    }

    const auditLog: AuditLogEvent = {
      eventCode: EventCode.HearingOutcomeSubmittedPhase3,
      eventType: auditLogEventLookup[EventCode.HearingOutcomeSubmittedPhase3],
      category: EventCategory.debug,
      eventSource: AuditLogEventSource.CorePhase2,
      timestamp: new Date(),
      attributes: {}
    }

    return completed({ auditLogEvents: [auditLog] }, "Sent to Phase 3 via MQ")
  })
}

export default sendToPhase3
