import type { ConductorWorker } from "@io-orkes/conductor-typescript"
import createS3Config from "common/s3/createS3Config"
import getFileFromS3 from "common/s3/getFileFromS3"
import putFileToS3 from "common/s3/putFileToS3"
import getTaskConcurrency from "conductor/src/getTaskConcurrency"
import type { Task } from "conductor/src/types/Task"
import { conductorLog } from "conductor/src/utils"
import { v4 as uuid } from "uuid"
import { isError } from "../../comparison/types"
import logger from "../../lib/logging"
import parseSpiResult from "../../parse/parseSpiResult"
import transformSpiToAho from "../../parse/transformSpiToAho"

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
