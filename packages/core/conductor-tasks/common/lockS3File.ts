import type { ConductorWorker } from "@io-orkes/conductor-javascript"
import completed from "@moj-bichard7/common/conductor/helpers/completed"
import failed from "@moj-bichard7/common/conductor/helpers/failed"
import failedTerminal from "@moj-bichard7/common/conductor/helpers/failedTerminal"
import inputDataValidator from "@moj-bichard7/common/conductor/middleware/inputDataValidator"
import type Task from "@moj-bichard7/common/conductor/types/Task"
import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import readS3FileTags from "@moj-bichard7/common/s3/readS3FileTags"
import writeS3FileTags from "@moj-bichard7/common/s3/writeS3FileTags"
import { isError } from "@moj-bichard7/common/types/Result"
import { z } from "zod"

const s3Config = createS3Config()

const inputDataSchema = z.object({
  fileName: z.string(),
  bucketId: z.string(),
  lockId: z.string()
})
type InputData = z.infer<typeof inputDataSchema>

const { TASK_DATA_BUCKET_NAME } = process.env
if (!TASK_DATA_BUCKET_NAME) {
  throw Error("TASK_DATA_BUCKET_NAME environment variable is required")
}

const buckets: Record<string, string> = {
  "task-data": TASK_DATA_BUCKET_NAME
}

const lockKey = "lockedByWorkstream"

// This provides basic locking to try to make sure the workflow doesn't get triggered twice.
// This implementation is not race-condition proof. However, the specific case we have
// with duplicate workflows separated by a period of time will be prevented by this.
// Currently there's a window of 2 - 5 seconds where multiple workflows could be started
// for the same message - this reduces the window to a few milliseconds
const lockS3File: ConductorWorker = {
  taskDefName: "lock_s3_file",
  execute: inputDataValidator(inputDataSchema, async (task: Task<InputData>) => {
    const { fileName, bucketId, lockId } = task.inputData

    const bucket = buckets[bucketId]
    if (!bucket) {
      return failedTerminal(`Bucket ID was not found: ${bucketId}`)
    }

    const tags = await readS3FileTags(fileName, bucket, s3Config)
    if (isError(tags)) {
      // File has already been removed
      if (
        tags.name === "NoSuchKey" ||
        (tags.name === "MethodNotAllowed" && "ResourceType" in tags && tags.ResourceType === "DeleteMarker")
      ) {
        return completed({ lockState: "failure" }, "S3 File already deleted")
      }

      console.error("Unexpected error locking the S3 file", tags)

      // Error reading the tags
      return failed(tags.message)
    }

    if (tags[lockKey]) {
      // File has already been locked
      return completed({ lockState: "failure" }, "S3 File already locked")
    }

    const result = await writeS3FileTags(fileName, bucket, { [lockKey]: lockId }, s3Config)
    if (isError(result)) {
      return failed(result.message)
    }

    const newTags = await readS3FileTags(fileName, bucket, s3Config)
    if (isError(newTags)) {
      return failed(newTags.message)
    }

    if (!newTags[lockKey] || newTags[lockKey] !== lockId) {
      // File has already been locked
      return failed("Error locking file")
    }

    return completed({ lockState: "success" }, "File successfully locked")
  })
}

export default lockS3File
