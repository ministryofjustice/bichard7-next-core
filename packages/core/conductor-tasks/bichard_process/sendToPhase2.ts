import type { ConductorWorker } from "@io-orkes/conductor-typescript"
import { dateReviver } from "@moj-bichard7/common/axiosDateTransformer"
import getTaskConcurrency from "@moj-bichard7/common/conductor/getTaskConcurrency"
import { conductorLog } from "@moj-bichard7/common/conductor/logging"
import type Task from "@moj-bichard7/common/conductor/types/Task"
import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import getFileFromS3 from "@moj-bichard7/common/s3/getFileFromS3"
import { AuditLogEventOptions, AuditLogEventSource } from "@moj-bichard7/common/types/AuditLogEvent"
import EventCategory from "@moj-bichard7/common/types/EventCategory"
import { isError } from "@moj-bichard7/common/types/Result"
import logger from "@moj-bichard7/common/utils/logger"
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

const sendToPhase2: ConductorWorker = {
  taskDefName,
  concurrency: getTaskConcurrency(taskDefName),
  execute: async (task: Task) => {
    try {
      const ahoS3Path: string | undefined = task.inputData?.ahoS3Path
      if (!ahoS3Path) {
        return {
          logs: [conductorLog("ahoS3Path must be provided")],
          status: "FAILED_WITH_TERMINAL_ERROR"
        }
      }

      const ahoFileContent = await getFileFromS3(ahoS3Path, taskDataBucket, s3Config)
      if (isError(ahoFileContent)) {
        logger.error(ahoFileContent)
        return {
          logs: [conductorLog("Could not retrieve file from S3")],
          status: "FAILED"
        }
      }

      // TODO: zod schema parsing for Phase1Result type
      const phase1SuccessResult = JSON.parse(ahoFileContent, dateReviver) as Phase1SuccessResult
      const result = await mqGateway.sendMessage(convertAhoToXml(phase1SuccessResult.hearingOutcome), mqQueue)
      if (isError(result)) {
        return {
          logs: [conductorLog("Failed to write to MQ")],
          status: "FAILED"
        }
      }

      const auditLog = {
        eventCode: AuditLogEventOptions.submittedToPhase2.code,
        eventType: AuditLogEventOptions.submittedToPhase2.type,
        category: EventCategory.debug,
        eventSource: AuditLogEventSource.CoreHandler,
        timestamp: new Date().toISOString(),
        attributes: {}
      }

      return {
        logs: [conductorLog("Sent to Phase 2 via MQ")],
        outputData: { auditLogEvents: [auditLog] },
        status: "COMPLETED"
      }
    } catch (e) {
      logger.error(e)
      return {
        logs: [conductorLog(`Send to phase 2 failed: ${(e as Error).message}`)],
        status: "FAILED"
      }
    }
  }
}

export default sendToPhase2
