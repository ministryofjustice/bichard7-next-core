import type { ConductorWorker } from "@io-orkes/conductor-typescript"
import { dateReviver } from "@moj-bichard7/common/axiosDateTransformer"
import getTaskConcurrency from "@moj-bichard7/common/conductor/getTaskConcurrency"
import { conductorLog } from "@moj-bichard7/common/conductor/logging"
import type Task from "@moj-bichard7/common/conductor/types/Task"
import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import getFileFromS3 from "@moj-bichard7/common/s3/getFileFromS3"
import { isError } from "@moj-bichard7/common/types/Result"
import logger from "@moj-bichard7/common/utils/logger"
import postgres from "postgres"
import createDbConfig from "../../lib/database/createDbConfig"
import saveErrorListRecord from "../../lib/database/saveErrorListRecord"
import { phase1ResultSchema } from "../../phase1/schemas/phase1Result"
import { type Phase1SuccessResult } from "../../phase1/types/Phase1Result"

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

    const ahoFileContent = await getFileFromS3(taskDataS3Path, taskDataBucket, s3Config)
    if (isError(ahoFileContent)) {
      logger.error(ahoFileContent)
      return Promise.resolve({
        status: "FAILED",
        logs: [conductorLog(`Could not retrieve file from S3: ${taskDataS3Path}`), conductorLog(ahoFileContent.message)]
      })
    }

    const parsedResult = phase1ResultSchema.safeParse(ahoFileContent)
    if (!parsedResult.success) {
      return {
        status: "FAILED_WITH_TERMINAL_ERROR",
        logs: [conductorLog("Failed parsing phase 1 result")] // TODO: add zod issues here?
      }
    }

    const logs: string[] = []
    const result = JSON.parse(ahoFileContent, dateReviver) as Phase1SuccessResult
    if (result.triggers.length > 0 || result.hearingOutcome.Exceptions.length > 0) {
      const dbResult = await saveErrorListRecord(db, result)
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
