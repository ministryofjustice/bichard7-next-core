import type { ConductorWorker } from "@io-orkes/conductor-javascript"
import getTaskConcurrency from "@moj-bichard7/common/conductor/getTaskConcurrency"
import completed from "@moj-bichard7/common/conductor/helpers/completed"
import failed from "@moj-bichard7/common/conductor/helpers/failed"
import s3TaskDataFetcher from "@moj-bichard7/common/conductor/middleware/s3TaskDataFetcher"
import { AuditLogEventSource, auditLogEventLookup, type AuditLogEvent } from "@moj-bichard7/common/types/AuditLogEvent"
import EventCategory from "@moj-bichard7/common/types/EventCategory"
import EventCode from "@moj-bichard7/common/types/EventCode"
import { isError } from "@moj-bichard7/common/types/Result"
import MqGateway from "../../lib/mq/MqGateway"
import createMqConfig from "../../lib/mq/createMqConfig"
import { phase1SuccessResultSchema } from "../../phase1/schemas/phase1Result"
import convertAhoToXml from "../../phase1/serialise/ahoXml/generate"
import type { Phase1SuccessResult } from "../../phase1/types/Phase1Result"

const mqConfig = createMqConfig()
const mqGateway = new MqGateway(mqConfig)
const mqQueue = process.env.PHASE_2_QUEUE_NAME ?? "HEARING_OUTCOME_PNC_UPDATE_QUEUE"

const taskDefName = "send_to_phase2"

const sendToPhase2: ConductorWorker = {
  taskDefName,
  concurrency: getTaskConcurrency(taskDefName),
  execute: s3TaskDataFetcher<Phase1SuccessResult>(phase1SuccessResultSchema, async (task) => {
    const { s3TaskData } = task.inputData

    const result = await mqGateway.sendMessage(convertAhoToXml(s3TaskData.hearingOutcome), mqQueue)
    if (isError(result)) {
      return failed("Failed to write to MQ")
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
