import type { ConductorWorker } from "@io-orkes/conductor-javascript"
import type Task from "@moj-bichard7/common/conductor/types/Task"
import type { AuditLogApiRecordInput } from "@moj-bichard7/common/types/AuditLogRecord"
import type { Result } from "@moj-bichard7/common/types/Result"

import completed from "@moj-bichard7/common/conductor/helpers/completed"
import failed from "@moj-bichard7/common/conductor/helpers/failed"
import inputDataValidator from "@moj-bichard7/common/conductor/middleware/inputDataValidator"
import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import getFileFromS3 from "@moj-bichard7/common/s3/getFileFromS3"
import putFileToS3 from "@moj-bichard7/common/s3/putFileToS3"
import EventCode from "@moj-bichard7/common/types/EventCode"
import { isError } from "@moj-bichard7/common/types/Result"
import logger from "@moj-bichard7/common/utils/logger"
import { randomUUID } from "crypto"
import { z } from "zod"

import {
  extractIncomingMessage,
  extractXMLEntityContent,
  getCorrelationId,
  getDataStreamContent,
  getSystemId
} from "../../lib/parse/transformSpiToAho/extractIncomingMessageData"
import transformIncomingMessageToAho from "../../lib/parse/transformSpiToAho/transformIncomingMessageToAho"
import parseS3Path from "../../phase1/lib/parseS3Path"

const incomingBucket = process.env.INCOMING_BUCKET_NAME
if (!incomingBucket) {
  throw Error("INCOMING_BUCKET_NAME environment variable is required")
}

const outgoingBucket = process.env.TASK_DATA_BUCKET_NAME
if (!outgoingBucket) {
  throw Error("TASK_DATA_BUCKET_NAME environment variable is required")
}

type MessageMetadata = {
  correlationId: string
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

  const { externalId, correlationId, receivedDate } = messageMetadata

  return {
    caseId: ptiUrn,
    createdBy: "Incoming message handler",
    externalCorrelationId,
    externalId: externalId,
    isSanitised: 0,
    messageHash: randomUUID(),
    messageId: correlationId,
    receivedDate: receivedDate.toISOString(),
    s3Path,
    systemId
  }
}

const buildParsingFailedOutput = (
  message: string,
  messageMetadata: MessageMetadata,
  s3Path: string,
  errorMessage: string
) => {
  const { correlationId, externalId, receivedDate } = messageMetadata

  const auditLogRecord = fallbackAuditLogRecord(message, messageMetadata, s3Path)
  if (isError(auditLogRecord)) {
    return auditLogRecord
  }

  return {
    correlationId,
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
      receivedDate: receivedDate.toISOString(),
      messageId: correlationId,
      externalId,
      ptiUrn: auditLogRecord.caseId,
      errorMessage
    }
  }
}

const inputDataSchema = z.object({
  correlationId: z.string(),
  s3Path: z.string()
})
type InputData = z.infer<typeof inputDataSchema>

const convertSpiToAho: ConductorWorker = {
  taskDefName: "convert_spi_to_aho",
  execute: inputDataValidator(inputDataSchema, async (task: Task<InputData>) => {
    const { s3Path, correlationId } = task.inputData

    const s3Config = createS3Config()
    const s3FileResult = await getFileFromS3(s3Path, incomingBucket, s3Config)
    if (isError(s3FileResult)) {
      return failed("Could not retrieve file from S3", s3FileResult.message)
    }

    const s3PathResult = parseS3Path(s3Path)
    if (isError(s3PathResult)) {
      return failed("Failed to parse S3 path", s3PathResult.message)
    }

    const { externalId, receivedDate } = s3PathResult
    const transformResult = transformIncomingMessageToAho(s3FileResult)
    if (isError(transformResult)) {
      // completed so we can move to alerting task
      return completed(
        buildParsingFailedOutput(
          s3FileResult,
          { correlationId, externalId, receivedDate },
          s3Path,
          transformResult.message
        ),
        "Could not convert incoming message to AHO",
        transformResult.message
      )
    }

    // Zod parsed correctly, continue as normal
    const { aho, messageHash, systemId } = transformResult

    // We replace the correlation ID to ensure it
    // doesn't clash with any other records in the database
    const externalCorrelationId = aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID
    aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID = correlationId

    const putPath = `${correlationId}.json`
    const maybeError = await putFileToS3(JSON.stringify(aho), putPath, outgoingBucket, s3Config)
    if (isError(maybeError)) {
      logger.error(maybeError)
      return failed("Could not put file to S3", maybeError.message)
    }

    const outputData = {
      s3TaskDataPath: putPath,
      auditLogRecord: {
        caseId: aho.AnnotatedHearingOutcome.HearingOutcome.Case.PTIURN,
        createdBy: "Incoming message handler",
        externalCorrelationId,
        externalId,
        isSanitised: 0,
        messageHash,
        messageId: correlationId,
        receivedDate,
        s3Path,
        systemId
      }
    }

    return completed(outputData, "Incoming message successfully converted to AHO")
  })
}

export default convertSpiToAho
