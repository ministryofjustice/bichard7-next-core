import type { ConductorWorker } from "@io-orkes/conductor-javascript"
import getTaskConcurrency from "@moj-bichard7/common/conductor/getTaskConcurrency"
import completed from "@moj-bichard7/common/conductor/helpers/completed"
import failed from "@moj-bichard7/common/conductor/helpers/failed"
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
  s3TaskDataPath: z.string()
})
type InputData = z.infer<typeof inputDataSchema>

const readAhoFromDb: ConductorWorker = {
  taskDefName,
  concurrency: getTaskConcurrency(taskDefName),
  execute: inputDataValidator(inputDataSchema, async (task: Task<InputData>) => {
    const { correlationId, s3TaskDataPath } = task.inputData

    const dbResult = await db<
      ErrorListRecord[]
    >`SELECT updated_msg from br7own.error_list WHERE message_id = ${correlationId}`

    const ahoXml = dbResult[0]?.updated_msg
    if (!ahoXml) {
      return failed(`Could not find message id in database: ${correlationId}`)
    }

    const aho = parseAhoXml(ahoXml)
    if (isError(aho)) {
      return failed("Failed to parse AHO from database", aho.message)
    }

    const maybeError = await putFileToS3(JSON.stringify(aho), s3TaskDataPath, taskDataBucket, s3Config)
    if (isError(maybeError)) {
      logger.error(maybeError)
      return failed("Could not put file to S3")
    }

    return completed("AHO successfully read from database")
  })
}

export default readAhoFromDb
