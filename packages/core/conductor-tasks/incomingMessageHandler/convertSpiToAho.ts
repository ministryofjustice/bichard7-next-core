import type { ConductorWorker } from "@io-orkes/conductor-typescript"
import getTaskConcurrency from "@moj-bichard7/common/conductor/getTaskConcurrency"
import { conductorLog } from "@moj-bichard7/common/conductor/logging"
import type Task from "@moj-bichard7/common/conductor/types/Task"
import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import getFileFromS3 from "@moj-bichard7/common/s3/getFileFromS3"
import putFileToS3 from "@moj-bichard7/common/s3/putFileToS3"
import EventCode from "@moj-bichard7/common/types/EventCode"
import { isError } from "@moj-bichard7/common/types/Result"
import logger from "@moj-bichard7/common/utils/logger"
import { v4 as uuid } from "uuid"
import parseS3Path from "../../phase1/lib/parseS3Path"
import {
  extractIncomingMessage,
  getDataStreamContent
} from "../../phase1/parse/transformSpiToAho/extractIncomingMessageData"
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

const extractXMLEntityContent = (content: string, tag: string) => {
  if (!content) {
    return "UNKNOWN"
  }

  const parts = content.match(new RegExp(`<${tag}>([^<]*)<\/${tag}>`))
  if (!parts || !parts.length) {
    return "UNKNOWN"
  }

  return parts[1]?.trim()
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

    const messageId = uuid()
    const { externalId, receivedDate } = parseS3Path(s3Path)

    const transformResult = transformIncomingMessageToAho(message)
    if (isError(transformResult)) {
      const extractedMessage = extractIncomingMessage(message)
      if (isError(extractedMessage)) {
        logger.error(extractedMessage)
        return Promise.resolve({
          logs: [conductorLog("Could not extract incoming message")],
          status: "FAILED"
        })
      }

      const externalCorrelationId = extractXMLEntityContent(message, "CorrelationID")
      const stream = getDataStreamContent(extractedMessage)
      const ptiUrn = extractXMLEntityContent(stream, "PTIURN")

      // TODO:
      // pull inline stuff into separate functions
      // write integration tests for alertCommonPlatform
      // pull out data extraction into a function with fallbacks
      // remove unknowns below
      // finish e2e tests

      return Promise.resolve({
        logs: [conductorLog("Could not convert incoming message to AHO")],
        status: "COMPLETED",
        outputData: {
          correlationId: messageId,
          error: "parsing_failed",
          auditLogRecord: {
            caseId: ptiUrn,
            createdBy: "Incoming message handler",
            externalCorrelationId,
            externalId: externalId,
            isSanitised: 0,
            messageHash: uuid(),
            messageId,
            receivedDate,
            s3Path,
            systemId: "UNKNOWN"
          },
          auditLogEvents: [
            {
              category: "error",
              eventCode: EventCode.MessageRejected,
              eventSource: "Incoming Message Handler",
              eventType: "Failed to parse incoming message",
              timestamp: new Date().toISOString()
            }
          ],
          errorReportData: {
            receivedDate,
            messageId,
            externalId,
            ptiUrn
          }
        }
      })
    }

    const { aho, messageHash, systemId } = transformResult

    const externalCorrelationId = aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID
    aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID = messageId

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
