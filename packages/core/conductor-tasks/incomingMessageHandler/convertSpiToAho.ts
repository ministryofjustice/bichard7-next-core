import type { ConductorWorker } from "@io-orkes/conductor-typescript"
import getTaskConcurrency from "@moj-bichard7/common/conductor/getTaskConcurrency"
import { conductorLog } from "@moj-bichard7/common/conductor/logging"
import type Task from "@moj-bichard7/common/conductor/types/Task"
import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import getFileFromS3 from "@moj-bichard7/common/s3/getFileFromS3"
import putFileToS3 from "@moj-bichard7/common/s3/putFileToS3"
import type { InputApiAuditLog } from "@moj-bichard7/common/types/AuditLogRecord"
import EventCode from "@moj-bichard7/common/types/EventCode"
import type { Result } from "@moj-bichard7/common/types/Result"
import { isError } from "@moj-bichard7/common/types/Result"
import logger from "@moj-bichard7/common/utils/logger"
import { v4 as uuid } from "uuid"
import parseS3Path from "../../phase1/lib/parseS3Path"
import {
  extractIncomingMessage,
  extractXMLEntityContent,
  getDataStreamContent
} from "../../phase1/parse/transformSpiToAho/extractIncomingMessageData"
import transformIncomingMessageToAho from "../../phase1/parse/transformSpiToAho/transformIncomingMessageToAho"

const incomingBucket = process.env.PHASE1_BUCKET_NAME
if (!incomingBucket) {
  throw Error("PHASE1_BUCKET_NAME environment variable is required")
}

const outgoingBucket = process.env.TASK_DATA_BUCKET_NAME
if (!outgoingBucket) {
  throw Error("TASK_DATA_BUCKET_NAME environment variable is required")
}

type MessageMetadata = {
  messageId: string
  externalId: string
  receivedDate: Date
}

// If incoming message doesn't match Zod schema
// then we will fall back to XML parsing
const fallbackAuditLogRecord = (
  message: string,
  messageMetadata: MessageMetadata,
  s3Path: string
): Result<InputApiAuditLog> => {
  const extractedMessage = extractIncomingMessage(message)
  let externalCorrelationId: string = "UNKNOWN"
  let ptiUrn: string = "UNKNOWN"
  let systemId: string = "UNKNOWN"

  if (isError(extractedMessage)) {
    externalCorrelationId = extractXMLEntityContent(message, "CorrelationID")
  } else {
    externalCorrelationId = extractedMessage.RouteData.RequestFromSystem.CorrelationID
    systemId = extractedMessage.RouteData.RequestFromSystem.SourceID

    const stream = getDataStreamContent(extractedMessage)
    ptiUrn = extractXMLEntityContent(stream, "PTIURN")
  }

  const { externalId, messageId, receivedDate } = messageMetadata

  return {
    caseId: ptiUrn,
    createdBy: "Incoming message handler",
    externalCorrelationId,
    externalId: externalId,
    isSanitised: 0,
    messageHash: uuid(),
    messageId,
    receivedDate: receivedDate.toString(),
    s3Path,
    systemId
  }
}

const buildParsingFailedOutput = (message: string, messageMetadata: MessageMetadata, s3Path: string) => {
  const { messageId, externalId, receivedDate } = messageMetadata

  const auditLogRecord = fallbackAuditLogRecord(message, messageMetadata, s3Path)
  if (isError(auditLogRecord)) {
    return auditLogRecord
  }

  return {
    correlationId: messageId,
    error: "parsing_failed",
    auditLogRecord,
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
      ptiUrn: auditLogRecord.caseId
    }
  }
}

const taskDefName = "convert_spi_to_aho"
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

    const s3Config = createS3Config()
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
      return Promise.resolve({
        logs: [conductorLog("Could not convert incoming message to AHO")],
        status: "COMPLETED", // complete so we can move to alerting task
        outputData: buildParsingFailedOutput(message, { messageId, externalId, receivedDate }, s3Path)
      })
    }

    // Zod parsed correctly, continue as normal
    const { aho, messageHash, systemId } = transformResult

    // We replace the correlation ID to ensure it
    // doesn't clash with any other records in the database
    const externalCorrelationId = aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID
    aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID = messageId

    const putPath = `${messageId}.json`
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
      outputData: {
        correlationId: messageId,
        ahoS3Path: putPath,
        auditLogRecord: {
          caseId: aho.AnnotatedHearingOutcome.HearingOutcome.Case.PTIURN,
          createdBy: "Incoming message handler",
          externalCorrelationId,
          externalId,
          isSanitised: 0,
          messageHash,
          messageId,
          receivedDate,
          s3Path,
          systemId
        }
      }
    })
  }
}

export default convertSpiToAho
