import type { ConductorWorker } from "@io-orkes/conductor-typescript"
import getTaskConcurrency from "@moj-bichard7/common/conductor/getTaskConcurrency"
import { conductorLog } from "@moj-bichard7/common/conductor/logging"
import type Task from "@moj-bichard7/common/conductor/types/Task"
import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import getFileFromS3 from "@moj-bichard7/common/s3/getFileFromS3"
import putFileToS3 from "@moj-bichard7/common/s3/putFileToS3"
import { AuditLogEventOptions, AuditLogEventSource } from "@moj-bichard7/common/types/AuditLogEvent"
import EventCategory from "@moj-bichard7/common/types/EventCategory"
import { isError } from "@moj-bichard7/common/types/Result"
import logger from "@moj-bichard7/common/utils/logger"
import CoreAuditLogger from "../../lib/CoreAuditLogger"
import PncGateway from "../../lib/PncGateway"
import createPncApiConfig from "../../lib/createPncApiConfig"
import getAuditLogEvent from "../../phase1/lib/auditLog/getAuditLogEvent"
import parseAhoJson from "../../phase1/parse/parseAhoJson"
import phase1 from "../../phase1/phase1"
import { Phase1ResultType } from "../../phase1/types/Phase1Result"

const taskDefName = "process_phase1"
const pncApiConfig = createPncApiConfig()

const s3Config = createS3Config()
const taskDataBucket = process.env.TASK_DATA_BUCKET_NAME ?? "conductor-task-data"

const processPhase1: ConductorWorker = {
  taskDefName,
  concurrency: getTaskConcurrency(taskDefName),
  execute: async (task: Task) => {
    const pncGateway = new PncGateway(pncApiConfig)
    const auditLogger = new CoreAuditLogger()
    const ahoS3Path: string | undefined = task.inputData?.ahoS3Path

    if (!ahoS3Path) {
      return Promise.resolve({
        status: "FAILED_WITH_TERMINAL_ERROR",
        logs: [conductorLog("s3Path must be specified")]
      })
    }

    const ahoFileContent = await getFileFromS3(ahoS3Path, taskDataBucket, s3Config)
    if (isError(ahoFileContent)) {
      logger.error(ahoFileContent)
      return Promise.resolve({
        status: "FAILED",
        logs: [conductorLog(`Could not retrieve file from S3: ${ahoS3Path}`), conductorLog(ahoFileContent.message)]
      })
    }

    const parsedAho = parseAhoJson(JSON.parse(ahoFileContent))

    auditLogger.logEvent(
      getAuditLogEvent(
        AuditLogEventOptions.hearingOutcomeReceivedPhase1,
        EventCategory.debug,
        AuditLogEventSource.CoreHandler,
        {}
      )
    )

    const result = await phase1(parsedAho, pncGateway, auditLogger)

    if (result.resultType === Phase1ResultType.success || result.resultType === Phase1ResultType.exceptions) {
      const maybeError = await putFileToS3(JSON.stringify(result), ahoS3Path, taskDataBucket, s3Config)
      if (isError(maybeError)) {
        return Promise.resolve({
          status: "FAILED",
          logs: [conductorLog(`Could not put file to S3: ${ahoS3Path}`), conductorLog(maybeError.message)]
        })
      }
    }

    return {
      status: "COMPLETED",
      logs: result.auditLogEvents.map((event) => conductorLog(event.eventType)),
      outputData: { resultType: result.resultType, auditLogEvents: result.auditLogEvents }
    }
  }
}

export default processPhase1
