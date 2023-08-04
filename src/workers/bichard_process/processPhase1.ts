import type { ConductorWorker } from "@io-orkes/conductor-typescript"
import getTaskConcurrency from "conductor/src/getTaskConcurrency"
import type { ConductorLog } from "conductor/src/types"
import type { Task } from "conductor/src/types/Task"
import { conductorLog } from "conductor/src/utils"
import postgres from "postgres"
import { isError } from "src/comparison/types"
import CoreAuditLogger from "src/lib/CoreAuditLogger"
import PncGateway from "src/lib/PncGateway"
import getAuditLogEvent from "src/lib/auditLog/getAuditLogEvent"
import createDbConfig from "src/lib/createDbConfig"
import createPncApiConfig from "src/lib/createPncApiConfig"
import createS3Config from "src/lib/createS3Config"
import saveErrorListRecord from "src/lib/database/saveErrorListRecord"
import getFileFromS3 from "src/lib/getFileFromS3"
import logger from "src/lib/logging"
import parseAhoJson from "src/parse/parseAhoJson"
import phase1 from "src/phase1"
import { Phase1ResultType } from "src/types/Phase1Result"
import { AuditLogEventOptions, AuditLogEventSource } from "../../types/AuditLogEvent"
import EventCategory from "../../types/EventCategory"

const taskDefName = "process_phase1"
const pncApiConfig = createPncApiConfig()
const dbConfig = createDbConfig()

const s3Config = createS3Config()
const taskDataBucket = process.env.TASK_DATA_BUCKET_NAME
if (!taskDataBucket) {
  throw Error("TASK_DATA_BUCKET_NAME environment variable is required")
}

const processPhase1: ConductorWorker = {
  taskDefName,
  concurrency: getTaskConcurrency(taskDefName),
  execute: async (task: Task) => {
    const db = postgres(dbConfig)
    const pncGateway = new PncGateway(pncApiConfig)
    const auditLogger = new CoreAuditLogger()
    const logs: ConductorLog[] = []
    const ahoS3Path: string | undefined = task.inputData?.ahoS3Path

    if (!ahoS3Path) {
      return Promise.resolve({
        logs: [conductorLog("s3Path must be specified")],
        status: "FAILED_WITH_TERMINAL_ERROR"
      })
    }

    const ahoFileContent = await getFileFromS3(ahoS3Path, taskDataBucket, s3Config)
    if (isError(ahoFileContent)) {
      logger.error(ahoFileContent)
      return Promise.resolve({
        logs: [conductorLog("Could not retrieve file from S3")],
        status: "FAILED"
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
    if (result.resultType === Phase1ResultType.failure || result.resultType === Phase1ResultType.ignored) {
      return {
        logs,
        outputData: { result: { ...result } },
        status: "FAILED_WITH_TERMINAL_ERROR"
      }
    }

    if (result.triggers.length > 0 || result.hearingOutcome.Exceptions.length > 0) {
      const dbResult = await saveErrorListRecord(db, result)

      if (isError(dbResult)) {
        return {
          logs,
          outputData: {
            result: {
              correlationId: result.correlationId,
              auditLogEvents: [],
              resultType: Phase1ResultType.failure
            }
          },
          status: "FAILED"
        }
      }
    }

    return {
      logs,
      outputData: { resultType: result.resultType, auditLogEvents: result.auditLogEvents },
      status: "COMPLETED"
    }
  }
}

export default processPhase1
