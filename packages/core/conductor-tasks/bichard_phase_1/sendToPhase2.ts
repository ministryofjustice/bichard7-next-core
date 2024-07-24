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
import createConductorClient from "@moj-bichard7/common/conductor/createConductorClient"

const mqQueue = process.env.PHASE_2_QUEUE_NAME ?? "HEARING_OUTCOME_PNC_UPDATE_QUEUE"
const { PHASE2_CORE_CANARY_RATIO } = process.env
const canaryRatio = PHASE2_CORE_CANARY_RATIO ? Number(PHASE2_CORE_CANARY_RATIO) : 0.0

enum Destination {
  CONDUCTOR = "Conductor",
  MQ = "MQ"
}

const getDestination = (): Destination => {
  const random = Math.random()

  if (canaryRatio > random) {
    return Destination.CONDUCTOR
  }

  return Destination.MQ
}

const conductorClient = createConductorClient()
const phase2WorkflowName = "bichard_phase_2"

const sendToPhase2: ConductorWorker = {
  taskDefName: "send_to_phase2",
  execute: s3TaskDataFetcher<Phase1Result>(phase1ResultSchema, async (task) => {
    const { s3TaskData, s3TaskDataPath } = task.inputData
    const correlationId =
      s3TaskData.hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID

    const destination = getDestination()

    if (destination === Destination.MQ) {
      const result = await connectAndSendMessage(mqQueue, serialiseToXml(s3TaskData.hearingOutcome)).catch(
        (e: Error) => e
      )

      if (isError(result)) {
        logger.error({ message: result.message, stack: result.stack })
        return failed("Failed to write to MQ", result.message)
      }

      logger.info({ event: "send-to-phase2:sent-to-mq", correlationId })
    } else {
      const workflowId = await conductorClient.workflowResource
        .startWorkflow1(phase2WorkflowName, { s3TaskDataPath }, undefined, correlationId)
        .catch((e: Error) => e)

      if (isError(workflowId)) {
        logger.error({ message: workflowId.message, stack: workflowId.stack })
        return failed(`Failed to start ${phase2WorkflowName} workflow`, workflowId.message)
      }

      logger.info({
        event: "send-to-phase2:started-workflow",
        workflowName: phase2WorkflowName,
        s3TaskDataPath,
        correlationId,
        workflowId
      })
    }

    const auditLog: AuditLogEvent = {
      eventCode: EventCode.HearingOutcomeSubmittedPhase2,
      eventType: auditLogEventLookup[EventCode.HearingOutcomeSubmittedPhase2],
      category: EventCategory.debug,
      eventSource: AuditLogEventSource.CorePhase1,
      timestamp: new Date(),
      attributes: {}
    }

    return completed({ auditLogEvents: [auditLog] }, `Sent to Phase 2 via ${destination}`)
  })
}

export default sendToPhase2
