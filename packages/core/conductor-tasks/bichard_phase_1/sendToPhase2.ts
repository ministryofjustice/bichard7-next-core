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
import serialiseToXml from "../../lib/serialise/ahoXml/serialiseToXml"
import { phase1ResultSchema } from "../../phase1/schemas/phase1Result"
import type Phase1Result from "../../phase1/types/Phase1Result"

const mqQueue = process.env.PHASE_2_QUEUE_NAME ?? "HEARING_OUTCOME_PNC_UPDATE_QUEUE"

const sendToPhase2: ConductorWorker = {
  taskDefName: "send_to_phase2",
  execute: s3TaskDataFetcher<Phase1Result>(phase1ResultSchema, async (task) => {
    const { s3TaskData } = task.inputData

    const result = await connectAndSendMessage(mqQueue, serialiseToXml(s3TaskData.hearingOutcome)).catch(
      (e) => e as Error
    )
    if (isError(result)) {
      logger.error({ message: result.message, stack: result.stack })
      return failed("Failed to write to MQ", result.message)
    }

    const auditLog: AuditLogEvent = {
      eventCode: EventCode.HearingOutcomeSubmittedPhase2,
      eventType: auditLogEventLookup[EventCode.HearingOutcomeSubmittedPhase2],
      category: EventCategory.debug,
      eventSource: AuditLogEventSource.CorePhase1,
      timestamp: new Date(),
      attributes: {}
    }

    return completed({ auditLogEvents: [auditLog] }, "Sent to Phase 2 via MQ")
  })
}

export default sendToPhase2
