import type { ConductorWorker } from "@io-orkes/conductor-javascript"
import { dateReviver } from "@moj-bichard7/common/axiosDateTransformer"
import getTaskConcurrency from "@moj-bichard7/common/conductor/getTaskConcurrency"
import completed from "@moj-bichard7/common/conductor/helpers/completed"
import failed from "@moj-bichard7/common/conductor/helpers/failed"
import inputDataValidator from "@moj-bichard7/common/conductor/middleware/inputDataValidator"
import type Task from "@moj-bichard7/common/conductor/types/Task"
import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import getFileFromS3 from "@moj-bichard7/common/s3/getFileFromS3"
import { AuditLogEventSource, auditLogEventLookup, type AuditLogEvent } from "@moj-bichard7/common/types/AuditLogEvent"
import EventCategory from "@moj-bichard7/common/types/EventCategory"
import EventCode from "@moj-bichard7/common/types/EventCode"
import { isError } from "@moj-bichard7/common/types/Result"
import logger from "@moj-bichard7/common/utils/logger"
import { z } from "zod"
import MqGateway from "../../lib/mq/MqGateway"
import createMqConfig from "../../lib/mq/createMqConfig"
import convertAhoToXml from "../../phase1/serialise/ahoXml/generate"
import type { Phase1SuccessResult } from "../../phase1/types/Phase1Result"

const mqConfig = createMqConfig()
const mqGateway = new MqGateway(mqConfig)
const mqQueue = process.env.PHASE_2_QUEUE_NAME ?? "HEARING_OUTCOME_PNC_UPDATE_QUEUE"

const taskDefName = "send_to_phase2"

const s3Config = createS3Config()
const taskDataBucket = process.env.TASK_DATA_BUCKET_NAME
if (!taskDataBucket) {
  throw Error("TASK_DATA_BUCKET_NAME environment variable is required")
}

const inputDataSchema = z.object({
  ahoS3Path: z.string()
})
type InputData = z.infer<typeof inputDataSchema>

const sendToPhase2: ConductorWorker = {
  taskDefName,
  concurrency: getTaskConcurrency(taskDefName),
  execute: inputDataValidator(inputDataSchema, async (task: Task<InputData>) => {
    const { ahoS3Path } = task.inputData

    const ahoFileContent = await getFileFromS3(ahoS3Path, taskDataBucket, s3Config)
    if (isError(ahoFileContent)) {
      logger.error(ahoFileContent)
      return failed("Could not retrieve file from S3")
    }

    // TODO: zod schema parsing for Phase1Result type
    const phase1SuccessResult = JSON.parse(ahoFileContent, dateReviver) as Phase1SuccessResult
    const result = await mqGateway.sendMessage(convertAhoToXml(phase1SuccessResult.hearingOutcome), mqQueue)
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
