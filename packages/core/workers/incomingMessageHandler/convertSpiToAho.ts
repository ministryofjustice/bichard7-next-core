import type { ConductorWorker } from "@io-orkes/conductor-typescript"
import getTaskConcurrency from "@moj-bichard7/common/conductor/getTaskConcurrency"
import { conductorLog } from "@moj-bichard7/common/conductor/logging"
import type Task from "@moj-bichard7/common/conductor/types/Task"
import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import getFileFromS3 from "@moj-bichard7/common/s3/getFileFromS3"
import putFileToS3 from "@moj-bichard7/common/s3/putFileToS3"
import { isError } from "@moj-bichard7/common/types/Result"
import logger from "@moj-bichard7/common/utils/logger"
import { v4 as uuid } from "uuid"
import parseS3Path from "../../phase1/lib/parseS3Path"
import transformIncomingMessageToAho from "../../phase1/parse/transformSpiToAho/transformIncomingMessageToAho"

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

    const transformResult = transformIncomingMessageToAho(message)
    if (isError(transformResult)) {
      return Promise.resolve({
        logs: [conductorLog("Could not convert incoming message to AHO")],
        status: "FAILED_WITH_TERMINAL_ERROR"
      })
    }

    const { aho, messageHash, systemId } = transformResult

    const externalCorrelationId = aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID
    const messageId = uuid()
    aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID = messageId

    const { externalId, receivedDate } = parseS3Path(s3Path)
    const auditLogRecord = {
      caseId: aho.AnnotatedHearingOutcome.HearingOutcome.Case.PTIURN,
      createdBy: "Incoming message handler",
      externalCorrelationId,
      externalId: externalId,
      isSanitised: 0,
      messageHash,
      messageId,
      receivedDate,
      s3Path,
      systemId
    }

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
      outputData: { correlationId: messageId, ahoS3Path: putPath, auditLogRecord }
    })
  }
}

export default convertSpiToAho
