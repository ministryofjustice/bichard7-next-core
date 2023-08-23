import type { ConductorWorker } from "@io-orkes/conductor-typescript"
import getTaskConcurrency from "@moj-bichard7/common/conductor/getTaskConcurrency"
import { conductorLog } from "@moj-bichard7/common/conductor/logging"
import type ConductorLog from "@moj-bichard7/common/conductor/types/ConductorLog"
import type Task from "@moj-bichard7/common/conductor/types/Task"
import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import getFileFromS3 from "@moj-bichard7/common/s3/getFileFromS3"
import putFileToS3 from "@moj-bichard7/common/s3/putFileToS3"
import { AuditLogEventOptions, AuditLogEventSource } from "@moj-bichard7/common/types/AuditLogEvent"
import EventCategory from "@moj-bichard7/common/types/EventCategory"
import { isError } from "@moj-bichard7/common/types/Result"
import logger from "@moj-bichard7/common/utils/logger"
import CoreAuditLogger from "lib/CoreAuditLogger"
import PncGateway from "lib/PncGateway"
import createPncApiConfig from "lib/createPncApiConfig"
import createDbConfig from "lib/database/createDbConfig"
import saveErrorListRecord from "lib/database/saveErrorListRecord"
import getAuditLogEvent from "phase1/lib/auditLog/getAuditLogEvent"
import parseAhoJson from "phase1/parse/parseAhoJson"
import phase1 from "phase1/phase1"
import { Phase1ResultType } from "phase1/types/Phase1Result"
import postgres from "postgres"

const taskDefName = "process_phase1"
const pncApiConfig = createPncApiConfig()
const dbConfig = createDbConfig()

const s3Config = createS3Config()
const taskDataBucket = process.env.TASK_DATA_BUCKET_NAME ?? "conductor-task-data"

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

    const maybeError = await putFileToS3(JSON.stringify(result.hearingOutcome), ahoS3Path, taskDataBucket, s3Config)
    if (isError(maybeError)) {
      logger.error(maybeError)
      return Promise.resolve({
        logs: [conductorLog("Could not put file to S3")],
        status: "FAILED"
      })
    }

    return {
      logs,
      outputData: { resultType: result.resultType, auditLogEvents: result.auditLogEvents },
      status: "COMPLETED"
    }
  }
}

export default processPhase1
