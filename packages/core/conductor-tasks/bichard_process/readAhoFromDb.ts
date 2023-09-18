import type { ConductorWorker } from "@io-orkes/conductor-javascript"
import getTaskConcurrency from "@moj-bichard7/common/conductor/getTaskConcurrency"
import { conductorLog } from "@moj-bichard7/common/conductor/logging"
import inputDataValidator from "@moj-bichard7/common/conductor/middleware/inputDataValidator"
import type Task from "@moj-bichard7/common/conductor/types/Task"
import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import putFileToS3 from "@moj-bichard7/common/s3/putFileToS3"
import { isError } from "@moj-bichard7/common/types/Result"
import logger from "@moj-bichard7/common/utils/logger"
import postgres from "postgres"
import { z } from "zod"
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

const inputDataSchema = z.object({
  correlationId: z.string(),
  ahoS3Path: z.string()
})
type InputData = z.infer<typeof inputDataSchema>

const readAhoFromDb: ConductorWorker = {
  taskDefName,
  concurrency: getTaskConcurrency(taskDefName),
  execute: inputDataValidator(inputDataSchema, async (task: Task<InputData>) => {
    const { correlationId, ahoS3Path } = task.inputData

    const dbResult = await db<
      ErrorListRecord[]
    >`SELECT updated_msg from br7own.error_list WHERE message_id = ${correlationId}`

    const ahoXml = dbResult[0]?.updated_msg
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
      logs: [conductorLog("AHO successfully read from database")],
      status: "COMPLETED"
    }
  })
}

export default readAhoFromDb
