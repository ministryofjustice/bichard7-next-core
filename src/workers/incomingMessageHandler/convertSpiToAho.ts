import type { ConductorWorker } from "@io-orkes/conductor-typescript"
import getTaskConcurrency from "conductor/src/getTaskConcurrency"
import type { Task } from "conductor/src/types/Task"
import { conductorLog } from "conductor/src/utils"
import { isError } from "src/comparison/types"
import createS3Config from "src/lib/createS3Config"
import getFileFromS3 from "src/lib/getFileFromS3"
import logger from "src/lib/logging"
import putFileToS3 from "src/lib/putFileToS3"
import parseSpiResult from "src/parse/parseSpiResult"
import transformSpiToAho from "src/parse/transformSpiToAho/transformSpiToAho"
import { v4 as uuid } from "uuid"

const taskDefName = "convert_spi_to_aho"

const s3Config = createS3Config()
const incomingBucket = process.env.PHASE1_BUCKET_NAME
if (!incomingBucket) {
  throw Error("PHASE1_BUCKET_NAME environment variable is required")
}

const outgoingBucket = process.env.TASK_DATA_BUCKET_NAME
if (!outgoingBucket) {
  throw Error("TASK_DATA_BUCKET_NAME environment variable is required")
}

const convertSpiToAho: ConductorWorker = {
  taskDefName,
  concurrency: getTaskConcurrency(taskDefName),
  execute: async (task: Task) => {
    const s3Path: string | undefined = task.inputData?.s3Path
    if (!s3Path) {
      return Promise.resolve({
        logs: [conductorLog("s3Path must be specified")],
        status: "FAILED_WITH_TERMINAL_ERROR"
      })
    }

    const message = await getFileFromS3(s3Path, incomingBucket, s3Config)
    if (isError(message)) {
      logger.error(message)
      return Promise.resolve({
        logs: [conductorLog("Could not retrieve file from S3")],
        status: "FAILED"
      })
    }

    const spiResult = parseSpiResult(message)
    const aho = transformSpiToAho(spiResult)
    const correlationId = aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID

    // put aho in s3
    const putPath = `${uuid()}.json`
    const maybeError = await putFileToS3(JSON.stringify(aho), putPath, outgoingBucket, s3Config)
    if (isError(maybeError)) {
      logger.error(maybeError)
      return {
        logs: [conductorLog("Could not put file to S3")],
        status: "FAILED"
      }
    }

    return Promise.resolve({
      logs: [],
      status: "COMPLETED",
      outputData: { correlationId, ahoS3Path: putPath }
    })
  }
}

export default convertSpiToAho
