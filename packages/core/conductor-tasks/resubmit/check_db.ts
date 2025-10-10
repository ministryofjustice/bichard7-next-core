import type { ConductorWorker } from "@io-orkes/conductor-javascript"
import type Task from "@moj-bichard7/common/conductor/types/Task"
import type { CaseRow } from "@moj-bichard7/common/types/Case"

import { completed, failed } from "@moj-bichard7/common/conductor/helpers/index"
import inputDataValidator from "@moj-bichard7/common/conductor/middleware/inputDataValidator"
import createDbConfig from "@moj-bichard7/common/db/createDbConfig"
import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import putFileToS3 from "@moj-bichard7/common/s3/putFileToS3"
import { isError } from "@moj-bichard7/common/types/Result"
import postgres from "postgres"
import { z } from "zod"

import ResolutionStatus from "../../types/ResolutionStatus"

const taskDataBucket = process.env.TASK_DATA_BUCKET_NAME || "conductor-task-data"

const s3Config = createS3Config()
const dbConfig = createDbConfig()

const inputDataSchema = z.object({
  messageId: z.string().or(z.uuid())
})
type InputData = z.infer<typeof inputDataSchema>

const checkDb: ConductorWorker = {
  taskDefName: "check_db",
  execute: inputDataValidator(inputDataSchema, async (task: Task<InputData>) => {
    const { messageId } = task.inputData
    const db = postgres(dbConfig)

    const [caseRow] = (await db`SELECT * FROM br7own.error_list el WHERE el.message_id = ${messageId}`) as CaseRow[]

    if (!caseRow) {
      return failed(`Case not found: ${messageId}`)
    }

    if (caseRow.error_status !== ResolutionStatus.SUBMITTED || !caseRow.error_locked_by_id) {
      return failed("Case has wrong Error Status or has no lock")
    }

    const s3Data = JSON.stringify({ messageId, errorLockedByUsername: caseRow.error_locked_by_id })

    const s3TaskDataPath = `${messageId}.json`
    const s3Result = await putFileToS3(s3Data, s3TaskDataPath, taskDataBucket, s3Config)

    if (isError(s3Result)) {
      return failed(`${s3Result.name}: ${s3Result.message}`)
    }

    return completed({ s3TaskDataPath }, `Can be resubmitted ${messageId}`)
  })
}

export default checkDb
