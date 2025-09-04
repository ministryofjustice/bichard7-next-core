import type { ConductorWorker } from "@io-orkes/conductor-javascript"

import createConductorClient from "@moj-bichard7/common/conductor/createConductorClient"
import completed from "@moj-bichard7/common/conductor/helpers/completed"
import failed from "@moj-bichard7/common/conductor/helpers/failed"
import s3TaskDataFetcher from "@moj-bichard7/common/conductor/middleware/s3TaskDataFetcher"
import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import putFileToS3 from "@moj-bichard7/common/s3/putFileToS3"
import { type AuditLogEvent, auditLogEventLookup, AuditLogEventSource } from "@moj-bichard7/common/types/AuditLogEvent"
import EventCategory from "@moj-bichard7/common/types/EventCategory"
import EventCode from "@moj-bichard7/common/types/EventCode"
import { isError } from "@moj-bichard7/common/types/Result"
import logger from "@moj-bichard7/common/utils/logger"
import path from "path"

import type Phase2Result from "../../phase2/types/Phase2Result"

import connectAndSendMessage from "../../lib/mq/connectAndSendMessage"
import serialiseToXml from "../../lib/serialise/pncUpdateDatasetXml/serialiseToXml"
import { phase2ResultSchema } from "../../phase2/schemas/phase2Result"

const s3Config = createS3Config()
const conductorClient = createConductorClient()
const phase3WorkflowName = "bichard_phase_3"

const mqQueue = process.env.PHASE_3_QUEUE_NAME || "PNC_UPDATE_REQUEST_QUEUE"

const outgoingBucket = process.env.TASK_DATA_BUCKET_NAME
if (!outgoingBucket) {
  throw Error("TASK_DATA_BUCKET_NAME environment variable is required")
}

enum Destination {
  CONDUCTOR = "Conductor",
  MQ = "MQ"
}

const getCanaryRatio = (phase3CanaryRatio?: number) => {
  if (phase3CanaryRatio !== undefined && phase3CanaryRatio !== -1) {
    return phase3CanaryRatio
  }

  const canaryRatio = Number(process.env.PHASE3_CORE_CANARY_RATIO)
  return isNaN(canaryRatio) ? 0.0 : canaryRatio
}

const getDestination = (phase3CanaryRatio?: number): Destination => {
  const random = Math.random()

  if (getCanaryRatio(phase3CanaryRatio) > random) {
    return Destination.CONDUCTOR
  }

  return Destination.MQ
}

const sendToPhase3: ConductorWorker = {
  taskDefName: "send_to_phase3",
  execute: s3TaskDataFetcher<Phase2Result>(phase2ResultSchema, async (task) => {
    const { s3TaskData, s3TaskDataPath, options } = task.inputData
    const correlationId =
      s3TaskData.outputMessage.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID

    const phase3CanaryRatio = isNaN(Number(options?.phase3CanaryRatio)) ? undefined : Number(options?.phase3CanaryRatio)
    const destination = getDestination(phase3CanaryRatio)

    if (destination === Destination.MQ) {
      const result = await connectAndSendMessage(mqQueue, serialiseToXml(s3TaskData.outputMessage)).catch(
        (e: Error) => e
      )

      if (isError(result)) {
        logger.error({ message: result.message, stack: result.stack })
        return failed("Failed to write to MQ", result.message)
      }

      logger.info({ event: "send-to-phase3:sent-to-mq", correlationId })
    } else {
      const phase3S3TaskDataPath = path.parse(s3TaskDataPath).name.replace("phase2", "phase3.json")

      const s3Result = await putFileToS3(
        JSON.stringify(s3TaskData.outputMessage),
        phase3S3TaskDataPath,
        outgoingBucket,
        s3Config
      ).catch((e: Error) => e)

      if (isError(s3Result)) {
        logger.error(s3Result)
        return failed("Could not put file to S3", s3Result.message)
      }

      const workflowId = await conductorClient.workflowResource
        .startWorkflow1(phase3WorkflowName, { s3TaskDataPath: phase3S3TaskDataPath }, undefined, correlationId)
        .catch((e: Error) => e)

      if (isError(workflowId)) {
        logger.error({ message: workflowId.message, stack: workflowId.stack })
        return failed(`Failed to start ${phase3WorkflowName} workflow`, workflowId.message)
      }

      logger.info({
        event: "send-to-phase3:started-workflow",
        workflowName: phase3WorkflowName,
        s3TaskDataPath,
        correlationId,
        workflowId
      })
    }

    const auditLog: AuditLogEvent = {
      eventCode: EventCode.HearingOutcomeSubmittedPhase3,
      eventType: auditLogEventLookup[EventCode.HearingOutcomeSubmittedPhase3],
      category: EventCategory.debug,
      eventSource: AuditLogEventSource.CorePhase2,
      timestamp: new Date(),
      attributes: {}
    }

    return completed({ auditLogEvents: [auditLog] }, `Sent to Phase 3 via ${destination}`)
  })
}

export default sendToPhase3
