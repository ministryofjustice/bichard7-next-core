import type { ConductorWorker } from "@io-orkes/conductor-typescript"
import getTaskConcurrency from "@moj-bichard7/common/conductor/getTaskConcurrency"
import { conductorLog } from "@moj-bichard7/common/conductor/logging"
import type Task from "@moj-bichard7/common/conductor/types/Task"
import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import putFileToS3 from "@moj-bichard7/common/s3/putFileToS3"
import { isError } from "@moj-bichard7/common/types/Result"
import logger from "@moj-bichard7/common/utils/logger"
import postgres from "postgres"
import createDbConfig from "../../lib/database/createDbConfig"
import { parseAhoXml } from "../../phase1/parse/parseAhoXml"
import type ErrorListRecord from "../../phase1/types/ErrorListRecord"

const taskDefName = "read_aho_from_db"
const dbConfig = createDbConfig()
const db = postgres(dbConfig)

const s3Config = createS3Config()
const taskDataBucket = process.env.TASK_DATA_BUCKET_NAME
if (!taskDataBucket) {
  throw Error("TASK_DATA_BUCKET_NAME environment variable is required")
}

const readAhoFromDb: ConductorWorker = {
  taskDefName,
  concurrency: getTaskConcurrency(taskDefName),
  execute: async (task: Task) => {
    const correlationId = task.inputData?.correlationId

    const ahoS3Path: string | undefined = task.inputData?.ahoS3Path
    if (!ahoS3Path) {
      return Promise.resolve({
        logs: [conductorLog("s3Path must be specified")],
        status: "FAILED_WITH_TERMINAL_ERROR"
      })
    }

    const dbResult = await db<
      ErrorListRecord[]
    >`SELECT updated_msg from br7own.error_list WHERE message_id = ${correlationId}`

    const ahoXml = dbResult[0].updated_msg
    if (!ahoXml) {
      return {
        status: "FAILED"
      }
    }

    const aho = parseAhoXml(ahoXml)
    if (isError(aho)) {
      return {
        status: "FAILED"
      }
    }

    const maybeError = await putFileToS3(JSON.stringify(aho), ahoS3Path, taskDataBucket, s3Config)
    if (isError(maybeError)) {
      logger.error(maybeError)
      return Promise.resolve({
        logs: [conductorLog("Could not put file to S3")],
        status: "FAILED"
      })
    }

    return {
      logs: [conductorLog("Audit logs written to API")],
      status: "COMPLETED"
    }
  }
}

export default readAhoFromDb
