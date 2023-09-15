import type { ConductorWorker, Task } from "@io-orkes/conductor-javascript"
import { dateReviver } from "@moj-bichard7/common/axiosDateTransformer"
import getTaskConcurrency from "@moj-bichard7/common/conductor/getTaskConcurrency"
import { conductorLog } from "@moj-bichard7/common/conductor/logging"
import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import getFileFromS3 from "@moj-bichard7/common/s3/getFileFromS3"
import { isError } from "@moj-bichard7/common/types/Result"
import logger from "@moj-bichard7/common/utils/logger"
import postgres from "postgres"
import createDbConfig from "../../lib/database/createDbConfig"
import saveErrorListRecord from "../../lib/database/saveErrorListRecord"
import { persistablePhase1ResultSchema } from "../../phase1/schemas/phase1Result"

const taskDefName = "persist_phase1"

const dbConfig = createDbConfig()
const s3Config = createS3Config()
const taskDataBucket = process.env.TASK_DATA_BUCKET_NAME ?? "conductor-task-data"

const persistPhase1: ConductorWorker = {
  taskDefName,
  concurrency: getTaskConcurrency(taskDefName),
  execute: async (task: Task) => {
    const db = postgres(dbConfig)

    // TODO: replace ahoS3Path everywhere
    const taskDataS3Path: string | undefined = task.inputData?.ahoS3Path
    if (!taskDataS3Path) {
      return Promise.resolve({
        status: "FAILED_WITH_TERMINAL_ERROR",
        logs: [conductorLog("s3Path must be specified")]
      })
    }

    const s3Phase1Result = await getFileFromS3(taskDataS3Path, taskDataBucket, s3Config)
    if (isError(s3Phase1Result)) {
      logger.error(s3Phase1Result)
      return Promise.resolve({
        status: "FAILED",
        logs: [conductorLog(`Could not retrieve file from S3: ${taskDataS3Path}`), conductorLog(s3Phase1Result.message)]
      })
    }

    const maybePhase1Result = JSON.parse(s3Phase1Result, dateReviver)
    const parseAttempt = persistablePhase1ResultSchema.safeParse(maybePhase1Result)
    if (!parseAttempt.success) {
      const issues = JSON.stringify(parseAttempt.error.issues)
      return {
        status: "FAILED_WITH_TERMINAL_ERROR",
        logs: [conductorLog("Failed parsing phase 1 result"), conductorLog(issues)]
      }
    }

    const data = parseAttempt.data
    const logs: string[] = []
    if (data.triggers.length > 0 || data.hearingOutcome.Exceptions.length > 0) {
      const dbResult = await saveErrorListRecord(db, data)
      if (isError(dbResult)) {
        return {
          status: "FAILED",
          logs: [conductorLog("Error saving to the database"), conductorLog(dbResult.message)]
        }
      }
      logs.push("Phase 1 result persisted successfully")
    } else {
      logs.push("No triggers or exceptions present, no persist required")
    }

    return Promise.resolve({
      status: "COMPLETED",
      logs: logs.map(conductorLog)
    })
  }
}

export default persistPhase1
