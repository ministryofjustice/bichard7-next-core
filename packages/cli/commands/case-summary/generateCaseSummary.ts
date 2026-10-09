import { DynamoDBClient, ExecuteStatementCommand } from "@aws-sdk/client-dynamodb"
import { S3Client } from "@aws-sdk/client-s3"
import AuditLogDynamoGateway from "@moj-bichard7/api/services/gateways/dynamo/AuditLogDynamoGateway/AuditLogDynamoGateway"
import type { ApiAuditLogEvent, AuditLogEventAttributes } from "@moj-bichard7/api/types/AuditLogEvent"
import EventCode from "@moj-bichard7/common/types/EventCode"
import { convertPncJsonToLedsAsnQueryResponse } from "@moj-bichard7/e2e-tests/utils/converters/convertPncJsonToLeds/convertPncJsonToLedsAsnQueryResponse"
import convertPncToLeds from "@moj-bichard7/e2e-tests/utils/converters/convertPncToLeds"
import type { PncAsnQueryJson } from "@moj-bichard7/e2e-tests/utils/converters/convertPncXmlToJson/convertPncXmlToJson"
import convertPncXmlToJson from "@moj-bichard7/e2e-tests/utils/converters/convertPncXmlToJson/convertPncXmlToJson"
import mapAddDisposalResults from "./mappers/mapAddDisposalResults"
import mapPenaltyHearing from "./mappers/mapPenaltyHearing"
import mapQuery from "./mappers/mapQuery"
import mapRemand from "./mappers/mapRemand"
import mapSpi from "./mappers/mapSpi"
import mapSubsequentDisposalResults from "./mappers/mapSubsequentDisposalResults"
import printSummary from "./printSummary"
import type Metadata from "./types/Metadata"
import sensitiveFn from "./utils/sensitive"
import textStyle from "./utils/textStyle"

type GenerateCaseSummaryResult = {
  operations: Record<string, number>
  asn: string
  summary: object
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
  messageIndex?: number
}

const workspace = process.env.WORKSPACE ?? "production"
const auditLogTableName = `bichard-7-${workspace}-audit-log`
const eventsTableName = `bichard-7-${workspace}-audit-log-events`
const dynamoGateway = new AuditLogDynamoGateway({ auditLogTableName, eventsTableName })
const dynamoDbClient = new DynamoDBClient({ region: "eu-west-2" })
const s3Client = new S3Client({ region: "eu-west-2" })

const extractErrorMessages = (event: ApiAuditLogEvent) => {
  const regex = /<TXT>(I\d{4}[\s\S]*?)<\/TXT>/g
  const xmlString = event.attributes?.["PNC Response Message"]?.toString() ?? ""
  const errors = Array.from(xmlString.matchAll(regex), (match) => match[1].trim())

  return errors
}

const exceptionRegex = /Exception Type/

const extractCodeFromAttributes = (attributes: AuditLogEventAttributes, codeRegex: RegExp): string | undefined => {
  for (const [key, value] of Object.entries(attributes)) {
    if (key.match(codeRegex)) {
      return value.toString()
    }
  }
}

const generateCaseSummaryByMessageId = async (
  messageId: string,
  options: FullGenerateCaseSummaryOptions
): Promise<GenerateCaseSummaryResult> => {
  const output: GenerateCaseSummaryResult = {
    operations: {},
    asn: "",
    summary: {}
  }
  const s3Path = options.s3Path
  const sensitive = sensitiveFn(!!options?.redactSensitiveData)
  const events = await dynamoGateway.getEvents(messageId)
  if (events instanceof Error) {
    throw new Error(`Failed to get events from Dynamodb for message ID ${messageId}. ${events.message}`)
  }

  const generateOperationKey = (name: string, errors: string[]) => `${errors.length > 0 ? "❌" : "✅"} ${name}`

  let eventDetails: object[] = []
  await Promise.all(
    events.map(async (event) => {
      let operationKey = ""
      if (event.eventCode === EventCode.PncResponseReceived) {
        const errors = extractErrorMessages(event)
        const requestType = event.attributes?.["PNC Request Type"]
        if (requestType === "ENQASI") {
          operationKey = generateOperationKey("Query", errors)
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

          eventDetails.push(await mapQuery(queryResponse, errors, event.timestamp, sensitive))
        } else if (requestType === "DISARR") {
          operationKey = generateOperationKey("Disposal Results", errors)
          const content = convertPncToLeds(String(event.attributes?.["PNC Request Message"]), "Add Disposal")
          eventDetails.push(await mapAddDisposalResults(content, errors, event.timestamp, sensitive))
        } else if (requestType === "NEWREM") {
          operationKey = generateOperationKey("Remand", errors)
          const content = convertPncToLeds(String(event.attributes?.["PNC Request Message"]), "Remand")
          eventDetails.push(mapRemand(content, errors, event.timestamp, sensitive))
        } else if (requestType === "SUBVAR") {
          operationKey = generateOperationKey("Subsequently Varied", errors)
          const content = convertPncToLeds(String(event.attributes?.["PNC Request Message"]), "Subsequently Varied")
          eventDetails.push(
            await mapSubsequentDisposalResults(content, "Subsequently Varied", errors, event.timestamp, sensitive)
          )
        } else if (requestType === "SENDEF") {
          operationKey = generateOperationKey("Sentence Deferred", errors)
          const content = convertPncToLeds(String(event.attributes?.["PNC Request Message"]), "Sentence Deferred")
          eventDetails.push(
            await mapSubsequentDisposalResults(content, "Sentence Deferred", errors, event.timestamp, sensitive)
          )
        } else if (requestType === "PENHRG") {
          operationKey = generateOperationKey("Penalty Hearing", errors)
          const content = String(event.attributes?.["PNC Request Message"])
          eventDetails.push(mapPenaltyHearing(content, errors, event.timestamp, sensitive))
        }
      }

      if (event.eventCode === EventCode.ExceptionsGenerated && event.attributes) {
        operationKey = "Exception generated"
        eventDetails.push({
          metadata: {
            title: `❌ Exception generated (${extractCodeFromAttributes(event.attributes, exceptionRegex)})`,
            timestamp: event.timestamp,
            errors: []
          }
        })
      }

      if (operationKey) {
        output.operations[operationKey] = (output.operations[operationKey] ?? 0) + 1
      }
    })
  )

  eventDetails = eventDetails.sort((a, b) =>
    (a as { metadata: Metadata }).metadata.timestamp > (b as { metadata: Metadata }).metadata.timestamp ? 1 : -1
  )

  const formattedOperations = Object.keys(output.operations).map((key) => `${key} (${output.operations[key]})`)
  const metadata = {
    "Message ID": messageId,
    "SPI S3 Path": s3Path,
    "Received on": options.receivedDate,
    ASN: output.asn,
    "Case ID / PTIURN": options.caseId,
    Operations: formattedOperations
  }

  const spi = await mapSpi(s3Client, s3Path, options.receivedDate, sensitive)
  const summary = {
    metadata,
    events: [spi, ...eventDetails]
  }
  output.summary = summary

  if (options?.doNotPrintSummary !== true) {
    if (options.messageIndex) {
      const line = `${textStyle.fg.yellow}${textStyle.bold}${"═".repeat(60)}${textStyle.reset}`
      const messageTitle = `${textStyle.fg.yellow}${textStyle.bold}→ Message ${options.messageIndex}${textStyle.reset}`
      process.stdout.write([line, messageTitle, line].join("\n") + "\n\n")
    }

    printSummary(summary.metadata)
    summary.events.forEach((event) => printSummary(event))
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

  if ((result.Items?.length ?? 0) > 20) {
    console.log(
      `${textStyle.fg.red}${textStyle.bold}Too many cases found for PTIURN ${ptiUrn} (Total cases: ${result.Items?.length ?? 0})${textStyle.reset}`
    )

    return []
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
    throw new Error(`Could not find audit log for message ID ${messageId}`)
  }

  return auditLog
}

const generateCaseSummary = async (
  messageIdOrPtiUrn: string,
  options?: GenerateCaseSummaryOptions
): Promise<GenerateCaseSummaryResult[]> => {
  const isMessageId = messageIdOrPtiUrn.length === 36

  const auditLog = isMessageId ? await fetchAuditLog(messageIdOrPtiUrn) : undefined

  if (options?.usePtiUrnToFindAllCases || !isMessageId) {
    const auditLogs = await findAuditLogsByPtiUrn(auditLog?.caseId ?? messageIdOrPtiUrn)
    const result = []
    let messageIndex = 1
    for (const record of auditLogs) {
      result.push(
        await generateCaseSummaryByMessageId(record.messageId, {
          ...(options ?? {}),
          s3Path: record.s3Path,
          receivedDate: record.receivedDate,
          caseId: record.caseId,
          messageIndex: messageIndex++
        })
      )
    }

    return result
  }

  if (!auditLog) {
    console.log("Couldn't find audit log for message Id")
    return []
  }

  return [
    await generateCaseSummaryByMessageId(messageIdOrPtiUrn, {
      ...(options ?? {}),
      s3Path: auditLog.s3Path!,
      receivedDate: auditLog.receivedDate,
      caseId: auditLog.caseId
    })
  ]
}

export default generateCaseSummary
