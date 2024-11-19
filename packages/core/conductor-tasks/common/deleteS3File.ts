import type { ConductorWorker } from "@io-orkes/conductor-javascript"
import completed from "@moj-bichard7/common/conductor/helpers/completed"
import failed from "@moj-bichard7/common/conductor/helpers/failed"
import failedTerminal from "@moj-bichard7/common/conductor/helpers/failedTerminal"
import inputDataValidator from "@moj-bichard7/common/conductor/middleware/inputDataValidator"
import type Task from "@moj-bichard7/common/conductor/types/Task"
import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import deleteFileFromS3 from "@moj-bichard7/common/s3/deleteFileFromS3"
import { isError } from "@moj-bichard7/common/types/Result"
import { z } from "zod"

const s3Config = createS3Config()

const inputDataSchema = z.object({
  fileName: z.string(),
  bucketId: z.string()
})
type InputData = z.infer<typeof inputDataSchema>

const { TASK_DATA_BUCKET_NAME } = process.env
if (!TASK_DATA_BUCKET_NAME) {
  throw Error("TASK_DATA_BUCKET_NAME environment variable is required")
}

const buckets: Record<string, string> = {
  "task-data": TASK_DATA_BUCKET_NAME
}

const deleteS3File: ConductorWorker = {
  taskDefName: "delete_s3_file",
  execute: inputDataValidator(inputDataSchema, async (task: Task<InputData>) => {
    const { fileName, bucketId } = task.inputData

    const bucket = buckets[bucketId]
    if (!bucket) {
      return failedTerminal(`Bucket ID was not found: ${bucketId}`)
    }

    const result = await deleteFileFromS3(fileName, bucket, s3Config)
    if (isError(result)) {
      return failed(result.message)
    }

    return completed(`S3 file marked for deletion: ${fileName}`)
  })
}

export default deleteS3File
