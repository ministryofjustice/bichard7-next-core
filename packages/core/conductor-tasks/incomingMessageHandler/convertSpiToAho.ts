import type { ConductorWorker } from "@io-orkes/conductor-javascript"
import getTaskConcurrency from "@moj-bichard7/common/conductor/getTaskConcurrency"
import completed from "@moj-bichard7/common/conductor/helpers/completed"
import failed from "@moj-bichard7/common/conductor/helpers/failed"
import inputDataValidator from "@moj-bichard7/common/conductor/middleware/inputDataValidator"
import type Task from "@moj-bichard7/common/conductor/types/Task"
import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import getFileFromS3 from "@moj-bichard7/common/s3/getFileFromS3"
import putFileToS3 from "@moj-bichard7/common/s3/putFileToS3"
import type { AuditLogApiRecordInput } from "@moj-bichard7/common/types/AuditLogRecord"
import EventCode from "@moj-bichard7/common/types/EventCode"
import type { Result } from "@moj-bichard7/common/types/Result"
import { isError } from "@moj-bichard7/common/types/Result"
import logger from "@moj-bichard7/common/utils/logger"
import { v4 as uuid } from "uuid"
import { z } from "zod"
import parseS3Path from "../../phase1/lib/parseS3Path"
import {
  extractIncomingMessage,
  extractXMLEntityContent,
  getCorrelationId,
  getDataStreamContent,
  getSystemId
} from "../../phase1/parse/transformSpiToAho/extractIncomingMessageData"
import transformIncomingMessageToAho from "../../phase1/parse/transformSpiToAho/transformIncomingMessageToAho"

const incomingBucket = process.env.INCOMING_BUCKET_NAME
if (!incomingBucket) {
  throw Error("INCOMING_BUCKET_NAME environment variable is required")
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
// then we will fall back to XML parsing and then regex
const fallbackAuditLogRecord = (
  message: string,
  messageMetadata: MessageMetadata,
  s3Path: string
): Result<AuditLogApiRecordInput> => {
  const extractedMessage = extractIncomingMessage(message)
  let externalCorrelationId: string = "UNKNOWN"
  let ptiUrn: string = "UNKNOWN"
  let systemId: string = "UNKNOWN"

  if (isError(extractedMessage)) {
    externalCorrelationId = extractXMLEntityContent(message, "CorrelationID")
  } else {
    externalCorrelationId = getCorrelationId(extractedMessage)
    systemId = getSystemId(extractedMessage)

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
    receivedDate: receivedDate.toISOString(),
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
        timestamp: new Date()
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

const inputDataSchema = z.object({
  s3Path: z.string()
})
type InputData = z.infer<typeof inputDataSchema>

const taskDefName = "convert_spi_to_aho"

const convertSpiToAho: ConductorWorker = {
  taskDefName,
  concurrency: getTaskConcurrency(taskDefName),
  execute: inputDataValidator(inputDataSchema, async (task: Task<InputData>) => {
    const { s3Path } = task.inputData

    const s3Config = createS3Config()
    const message = await getFileFromS3(s3Path, incomingBucket, s3Config)
    if (isError(message)) {
      logger.error(message)
      return failed("Could not retrieve file from S3")
    }

    const messageId = uuid()
    const { externalId, receivedDate } = parseS3Path(s3Path)
    const transformResult = transformIncomingMessageToAho(message)
    if (isError(transformResult)) {
      // completed so we can move to alerting task
      return completed(
        buildParsingFailedOutput(message, { messageId, externalId, receivedDate }, s3Path),
        "Could not convert incoming message to AHO"
      )
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
      return failed("Could not put file to S3", maybeError.message)
    }

    const outputData = {
      correlationId: messageId,
      s3TaskDataPath: putPath,
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

    return completed(outputData, "Incoming message successfully converted to AHO")
  })
}

export default convertSpiToAho
