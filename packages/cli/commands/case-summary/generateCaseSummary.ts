import { DynamoDBClient, ExecuteStatementCommand } from "@aws-sdk/client-dynamodb"
import { S3Client } from "@aws-sdk/client-s3"
import AuditLogDynamoGateway from "@moj-bichard7/api/services/gateways/dynamo/AuditLogDynamoGateway/AuditLogDynamoGateway"
import type { ApiAuditLogEvent } from "@moj-bichard7/api/types/AuditLogEvent"
import EventCode from "@moj-bichard7/common/types/EventCode"
import { convertPncJsonToLedsAsnQueryResponse } from "@moj-bichard7/e2e-tests/utils/converters/convertPncJsonToLeds/convertPncJsonToLedsAsnQueryResponse"
import convertPncToLeds from "@moj-bichard7/e2e-tests/utils/converters/convertPncToLeds"
import type { PncAsnQueryJson } from "@moj-bichard7/e2e-tests/utils/converters/convertPncXmlToJson/convertPncXmlToJson"
import convertPncXmlToJson from "@moj-bichard7/e2e-tests/utils/converters/convertPncXmlToJson/convertPncXmlToJson"
import generateLinesForAddDisposal from "./textGenerators/generateLinesForAddDisposal"
import generateLinesForQuery from "./textGenerators/generateLinesForQuery"
import generateLinesForRemand from "./textGenerators/generateLinesForRemand"
import generateLinesForSpi from "./textGenerators/generateLinesForSpi"
import generateLinesForSubsequentDisposalResult from "./textGenerators/generateLinesForSubsequentDisposalResult"
import type EventDetails from "./types/EventDetails"
import addLineFn from "./utils/addLineFn"

type GenerateCaseSummaryResult = {
  hasExceptions: boolean
  hasPenaltyHearingUpdate: boolean
  operations: Record<string, number>
  asn: string
  summary: string
}

type GenerateCaseSummaryOptions = {
  doNotPrintSummary?: boolean
  redactSensitiveData?: boolean
  usePtiUrnToFindAllCases?: boolean
}

type FullGenerateCaseSummaryOptions = GenerateCaseSummaryOptions & {
  s3Path: string
  caseId: string
  receivedDate: string
}

const auditLogTableName = "bichard-7-production-audit-log"
const eventsTableName = "bichard-7-production-audit-log-events"
const dynamoGateway = new AuditLogDynamoGateway({ auditLogTableName, eventsTableName })
const dynamoDbClient = new DynamoDBClient({ region: "eu-west-2" })
const s3Client = new S3Client({ region: "eu-west-2" })

const extractErrorMessage = (event: ApiAuditLogEvent) => {
  const regex = /<TXT>(I\d{4}[\s\S]*?)<\/TXT>/g
  const xmlString = event.attributes?.["PNC Response Message"]?.toString() ?? ""
  const errors = Array.from(xmlString.matchAll(regex), (match) => match[1].trim())

  return errors
}

const generateCaseSummaryByMessageId = async (
  messageId: string,
  options: FullGenerateCaseSummaryOptions
): Promise<GenerateCaseSummaryResult> => {
  const output: GenerateCaseSummaryResult = {
    hasExceptions: false,
    hasPenaltyHearingUpdate: false,
    operations: {},
    asn: "",
    summary: ""
  }
  const lines: string[] = []
  const s3Path = options.s3Path
  const addLine = addLineFn(lines, !!options?.redactSensitiveData)
  const events = await dynamoGateway.getEvents(messageId)
  if (events instanceof Error) {
    throw Error(`Failed to get events from Dynamodb for message ID ${messageId}. ${events.message}`)
  }

  if (events.find(({ eventCode }) => eventCode.includes("exception"))) {
    output.hasExceptions = true
  }

  await generateLinesForSpi(s3Client, s3Path, options.receivedDate, addLine)
  addLine("")

  const eventDetails: EventDetails[] = []
  events
    .filter((event) => event.eventCode === EventCode.PncResponseReceived)
    .sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1))
    .forEach((event) => {
      const requestType = event.attributes?.["PNC Request Type"]
      if (requestType === "ENQASI") {
        output.asn =
          new RegExp(/<E07>(?<asn>.*)<\/E07>/)
            .exec(event.attributes?.["PNC Request Message"]?.toString() ?? "")
            ?.groups?.asn.replace(/\//g, "")
            .trim() ?? ""
        const pncJson = convertPncXmlToJson<PncAsnQueryJson>(String(event.attributes?.["PNC Response Message"]))
        const queryResponse = convertPncJsonToLedsAsnQueryResponse(pncJson, {
          asn: output.asn,
          personId: "-",
          reportId: "-",
          courtCaseId: "-"
        })

        eventDetails.push({
          queryResponse: {
            response: queryResponse,
            errors: extractErrorMessage(event),
            timestamp: event.timestamp
          }
        })
      } else if (requestType === "DISARR") {
        eventDetails.push({
          addDisposal: {
            request: convertPncToLeds(String(event.attributes?.["PNC Request Message"]), "Add Disposal"),
            errors: extractErrorMessage(event),
            timestamp: event.timestamp
          }
        })
      } else if (requestType === "NEWREM") {
        eventDetails.push({
          remand: {
            request: convertPncToLeds(String(event.attributes?.["PNC Request Message"]), "Remand"),
            errors: extractErrorMessage(event),
            timestamp: event.timestamp
          }
        })
      } else if (requestType === "SUBVAR") {
        eventDetails.push({
          subsequentlyVaried: {
            request: convertPncToLeds(String(event.attributes?.["PNC Request Message"]), "Subsequently Varied"),
            errors: extractErrorMessage(event),
            timestamp: event.timestamp
          }
        })
      } else if (requestType === "SENDEF") {
        eventDetails.push({
          sentenceDeferred: {
            request: convertPncToLeds(String(event.attributes?.["PNC Request Message"]), "Sentence Deferred"),
            errors: extractErrorMessage(event),
            timestamp: event.timestamp
          }
        })
      } else if (requestType === "PENHRG") {
        eventDetails.push({
          penaltyHearing: {
            request: String(event.attributes?.["PNC Request Message"]),
            errors: extractErrorMessage(event),
            timestamp: event.timestamp
          }
        })
      }
    })

  const generateOperationKey = (name: string, errors: string[]) => `${errors.length > 0 ? "❌" : "✅"} ${name}`

  for (const eventDetailsItem of eventDetails) {
    let operationKey = ""
    if (eventDetailsItem.queryResponse) {
      operationKey = generateOperationKey("Query", eventDetailsItem.queryResponse!.errors)
      await generateLinesForQuery(eventDetailsItem, addLine)
    } else if (eventDetailsItem.addDisposal) {
      operationKey = generateOperationKey("Disposal Results", eventDetailsItem.addDisposal.errors)
      await generateLinesForAddDisposal(eventDetailsItem, addLine)
    } else if (eventDetailsItem.remand) {
      operationKey = generateOperationKey("Remand", eventDetailsItem.remand.errors)
      await generateLinesForRemand(eventDetailsItem, addLine)
    } else if (eventDetailsItem.subsequentlyVaried) {
      operationKey = generateOperationKey("Subsequently Varied", eventDetailsItem.subsequentlyVaried.errors)
      await generateLinesForSubsequentDisposalResult(eventDetailsItem, "Subsequently Varied", addLine)
    } else if (eventDetailsItem.sentenceDeferred) {
      operationKey = generateOperationKey("Sentence Deferred", eventDetailsItem.sentenceDeferred.errors)
      await generateLinesForSubsequentDisposalResult(eventDetailsItem, "Sentence Deferred", addLine)
    } else if (eventDetailsItem.penaltyHearing) {
      const errors = eventDetailsItem.penaltyHearing!.errors
      operationKey = generateOperationKey("Penalty Hearing", eventDetailsItem.penaltyHearing.errors)
      addLine("==================================================================")
      addLine("Bichard Update: Penalty hearing")
      addLine("==================================================================")
      addLine("The request below failed to update with the following error message(s):", errors.length > 0)
      addLine(`\t${errors.join("\n\t")}`, errors.length > 0)
      addLine("------------------------------------------------------------------\n", errors.length > 0)
      addLine(`\n${eventDetailsItem.penaltyHearing}`, true, true)
    }

    addLine("")
    output.operations[operationKey] = (output.operations[operationKey] ?? 0) + 1
  }

  const operationsString = Object.keys(output.operations)
    .map((key) => `${key} (${output.operations[key]})`)
    .join(", ")
  const metadataLines = [
    "==================================================================",
    "==================================================================",
    `Message ID:       ${messageId}`,
    `SPI S3 Path:      ${s3Path}`,
    `Received on:      ${options.receivedDate}`,
    `ASN:              ${output.asn}`,
    `Case ID / PTIURN: ${options.caseId}`,
    `Operations:       ${operationsString}`,
    "\n"
  ]
  output.summary = metadataLines.concat(lines).join("\n")

  if (options?.doNotPrintSummary !== true) {
    console.log(output.summary)
  }

  return output
}

const findAuditLogsByPtiUrn = async (ptiUrn: string) => {
  const command = new ExecuteStatementCommand({
    Statement: `
      SELECT *
      FROM
        "${auditLogTableName}"."caseIdIndex"
      WHERE
        "caseId" = ?
      `,
    Parameters: [{ S: ptiUrn }]
  })
  const result = await dynamoDbClient.send(command).catch((error: Error) => error)
  if (result instanceof Error) {
    throw result
  }

  return (result.Items ?? [])
    .map((item) => ({
      messageId: item.messageId.S!,
      s3Path: item.s3Path.S!,
      receivedDate: item.receivedDate.S!,
      caseId: item.caseId.S!
    }))
    .sort((a, b) => (a.receivedDate > b.receivedDate ? 1 : -1))
}

const fetchAuditLog = async (messageId: string) => {
  const auditLog = await dynamoGateway.fetchOne(messageId)
  if (auditLog instanceof Error) {
    throw auditLog
  }

  if (!auditLog) {
    throw Error(`Could not find audit log for message ID ${messageId}`)
  }

  return auditLog
}

const generateCaseSummary = async (
  messageId: string,
  options?: GenerateCaseSummaryOptions
): Promise<GenerateCaseSummaryResult[]> => {
  const auditLog = await fetchAuditLog(messageId)

  if (options?.usePtiUrnToFindAllCases) {
    const auditLogs = await findAuditLogsByPtiUrn(auditLog.caseId)
    const result = []
    for (const record of auditLogs) {
      result.push(
        await generateCaseSummaryByMessageId(record.messageId, {
          ...(options ?? {}),
          s3Path: record.s3Path,
          receivedDate: record.receivedDate,
          caseId: record.caseId
        })
      )
    }

    return result
  }

  return [
    await generateCaseSummaryByMessageId(messageId, {
      ...(options ?? {}),
      s3Path: auditLog.s3Path!,
      receivedDate: auditLog.receivedDate,
      caseId: auditLog.caseId
    })
  ]
}

export default generateCaseSummary
