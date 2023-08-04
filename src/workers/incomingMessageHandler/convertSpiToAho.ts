import type { ConductorWorker } from "@io-orkes/conductor-typescript"
import getTaskConcurrency from "conductor/src/getTaskConcurrency"
import type { Task } from "conductor/src/types/Task"
import { conductorLog } from "conductor/src/utils"
import { isError } from "src/comparison/types"
import createS3Config from "src/lib/createS3Config"
import getFileFromS3 from "src/lib/getFileFromS3"
import logger from "src/lib/logging"
import parseSpiResult from "src/parse/parseSpiResult"
import transformSpiToAho from "src/parse/transformSpiToAho/transformSpiToAho"

const taskDefName = "convert_spi_to_aho"
const bucket = process.env.PHASE1_BUCKET_NAME
if (!bucket) {
  throw Error("PHASE1_BUCKET_NAME environment variable is required")
}
const s3Config = createS3Config()

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

    const message = await getFileFromS3(s3Path, bucket, s3Config)
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

    return Promise.resolve({
      logs: [],
      status: "COMPLETED",
      outputData: { correlationId, aho }
    })
  }
}

export default convertSpiToAho
