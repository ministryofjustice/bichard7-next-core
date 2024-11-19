import type { ConductorWorker } from "@io-orkes/conductor-javascript"
import createConductorClient from "@moj-bichard7/common/conductor/createConductorClient"
import completed from "@moj-bichard7/common/conductor/helpers/completed"
import failed from "@moj-bichard7/common/conductor/helpers/failed"
import s3TaskDataFetcher from "@moj-bichard7/common/conductor/middleware/s3TaskDataFetcher"
import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import putFileToS3 from "@moj-bichard7/common/s3/putFileToS3"
import { AuditLogEventSource, auditLogEventLookup, type AuditLogEvent } from "@moj-bichard7/common/types/AuditLogEvent"
import EventCategory from "@moj-bichard7/common/types/EventCategory"
import EventCode from "@moj-bichard7/common/types/EventCode"
import { isError } from "@moj-bichard7/common/types/Result"
import logger from "@moj-bichard7/common/utils/logger"
import path from "path"
import connectAndSendMessage from "../../lib/mq/connectAndSendMessage"
import serialiseToXml from "../../lib/serialise/ahoXml/serialiseToXml"
import { phase1ResultSchema } from "../../phase1/schemas/phase1Result"
import type Phase1Result from "../../phase1/types/Phase1Result"

const s3Config = createS3Config()
const conductorClient = createConductorClient()
const phase2WorkflowName = "bichard_phase_2"

const mqQueue = process.env.PHASE_2_QUEUE_NAME ?? "HEARING_OUTCOME_PNC_UPDATE_QUEUE"

const outgoingBucket = process.env.TASK_DATA_BUCKET_NAME
if (!outgoingBucket) {
  throw Error("TASK_DATA_BUCKET_NAME environment variable is required")
}

enum Destination {
  CONDUCTOR = "Conductor",
  MQ = "MQ"
}

const getCanaryRatio = (phase2CanaryRatio?: number) => {
  if (phase2CanaryRatio !== undefined && phase2CanaryRatio !== -1) {
    return phase2CanaryRatio
  }

  const canaryRatio = Number(process.env.PHASE2_CORE_CANARY_RATIO)
  return isNaN(canaryRatio) ? 0.0 : canaryRatio
}

const getDestination = (phase2CanaryRatio?: number): Destination => {
  const random = Math.random()

  if (getCanaryRatio(phase2CanaryRatio) > random) {
    return Destination.CONDUCTOR
  }

  return Destination.MQ
}

const sendToPhase2: ConductorWorker = {
  taskDefName: "send_to_phase2",
  execute: s3TaskDataFetcher<Phase1Result>(phase1ResultSchema, async (task) => {
    const { s3TaskData, s3TaskDataPath, options } = task.inputData
    const correlationId =
      s3TaskData.hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID

    const phase2CanaryRatio = isNaN(Number(options?.phase2CanaryRatio)) ? undefined : Number(options?.phase2CanaryRatio)
    const destination = getDestination(phase2CanaryRatio)

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
      const phase2S3TaskDataPath = path.parse(s3TaskDataPath).name.concat("-phase2.json")

      const s3Result = await putFileToS3(
        JSON.stringify(s3TaskData.hearingOutcome),
        phase2S3TaskDataPath,
        outgoingBucket,
        s3Config
      ).catch((e: Error) => e)

      if (isError(s3Result)) {
        logger.error(s3Result)
        return failed("Could not put file to S3", s3Result.message)
      }

      const workflowId = await conductorClient.workflowResource
        .startWorkflow1(phase2WorkflowName, { s3TaskDataPath: phase2S3TaskDataPath }, undefined, correlationId)
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
