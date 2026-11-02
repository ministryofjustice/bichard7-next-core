import { DynamoDBClient, ExecuteStatementCommand } from "@aws-sdk/client-dynamodb"
import { S3Client } from "@aws-sdk/client-s3"
import { exceptionDefinitions, triggerDefinitions } from "@moj-bichard7-developers/bichard7-next-data/dist"
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
  eventTypeCount: Record<string, number>
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
  exissCorrelationId: string
  sourceCorrelationId?: string
  systemId?: string
  receivedDate: string
  triggerStatus: string
  pncLedsStatus: string
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

const extractCodesFromAttributes = (
  attributes: AuditLogEventAttributes,
  codeRegex: RegExp
): { code: string; offenceIndex?: string }[] => {
  return Object.entries(attributes)
    .filter(([key]) => codeRegex.exec(key))
    .map(([_, value]) => {
      const result = new RegExp(/(?<code>(TRP[RS]\d{4})|(HO\d{6}))(?:\s*\((?<offence>\d+)\))?/).exec(
        value.toString()
      )?.groups

      return result ? { code: result.code, offenceIndex: result.offence } : { code: value.toString() }
    })
    .sort((a, b) => (`${a.code}${a.offenceIndex ?? ""}` > `${b.code}${b.offenceIndex ?? ""}` ? 1 : -1))
}

const extractTriggersFromAttributes = (attributes: AuditLogEventAttributes) => {
  const triggerCodes = extractCodesFromAttributes(attributes, /Trigger \d+ Details/)

  return triggerCodes.reduce(
    (acc, { code: triggerCode, offenceIndex }) => {
      let triggerCodeKey = triggerCode
      if (offenceIndex) {
        triggerCodeKey += ` (Offence #${offenceIndex})`
      }

      const trigger = triggerDefinitions.find(({ code }) => code === triggerCode)
      acc[triggerCodeKey] = trigger?.description ?? "⚠️ Definition missing from standing data"

      return acc
    },
    {} as Record<string, string>
  )
}

const extractExceptionsFromAttributes = (attributes: AuditLogEventAttributes) => {
  const exceptionCodes = extractCodesFromAttributes(attributes, /Exception Type/)

  return exceptionCodes.reduce(
    (acc, exceptionCode) => {
      const exception = exceptionDefinitions.find(({ code }) => code === exceptionCode.code)
      acc[exceptionCode.code] = exception
        ? {
            Description: exception.shortDescription,
            Cause: exception.cause
          }
        : "⚠️ Definition missing from standing data"

      return acc
    },
    {} as Record<string, Record<string, string> | string>
  )
}

const generateCaseSummaryByMessageId = async (
  messageId: string,
  options: FullGenerateCaseSummaryOptions
): Promise<GenerateCaseSummaryResult> => {
  const output: GenerateCaseSummaryResult = {
    eventTypeCount: {},
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
      let eventTypeKey = ""
      if (event.eventCode === EventCode.PncResponseReceived) {
        const errors = extractErrorMessages(event)
        const requestType = event.attributes?.["PNC Request Type"]
        if (requestType === "ENQASI") {
          eventTypeKey = generateOperationKey("Query", errors)
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
          eventTypeKey = generateOperationKey("Disposal Results", errors)
          const content = convertPncToLeds(String(event.attributes?.["PNC Request Message"]), "Add Disposal")
          eventDetails.push(await mapAddDisposalResults(content, errors, event.timestamp, sensitive))
        } else if (requestType === "NEWREM") {
          eventTypeKey = generateOperationKey("Remand", errors)
          const content = convertPncToLeds(String(event.attributes?.["PNC Request Message"]), "Remand")
          eventDetails.push(mapRemand(content, errors, event.timestamp, sensitive))
        } else if (requestType === "SUBVAR") {
          eventTypeKey = generateOperationKey("Subsequently Varied", errors)
          const content = convertPncToLeds(String(event.attributes?.["PNC Request Message"]), "Subsequently Varied")
          eventDetails.push(
            await mapSubsequentDisposalResults(content, "Subsequently Varied", errors, event.timestamp, sensitive)
          )
        } else if (requestType === "SENDEF") {
          eventTypeKey = generateOperationKey("Sentence Deferred", errors)
          const content = convertPncToLeds(String(event.attributes?.["PNC Request Message"]), "Sentence Deferred")
          eventDetails.push(
            await mapSubsequentDisposalResults(content, "Sentence Deferred", errors, event.timestamp, sensitive)
          )
        } else if (requestType === "PENHRG") {
          eventTypeKey = generateOperationKey("Penalty Hearing", errors)
          const content = String(event.attributes?.["PNC Request Message"])
          eventDetails.push(mapPenaltyHearing(content, errors, event.timestamp, sensitive))
        }
      } else if (event.eventCode === EventCode.TriggersGenerated && event.attributes) {
        eventTypeKey = "⚡️ Bichard Triggers Generated"
        eventDetails.push({
          metadata: {
            title: "⚡️ Bichard Triggers Generated",
            timestamp: event.timestamp,
            errors: []
          },
          Triggers: extractTriggersFromAttributes(event.attributes)
        })
      } else if (event.eventCode === EventCode.TriggersLocked) {
        eventTypeKey = "🔒 Bichard Triggers Locked"
        eventDetails.push({
          metadata: {
            title: "🔒 Bichard Triggers Locked",
            timestamp: event.timestamp,
            errors: []
          },
          "Locked by": event.user
        })
      } else if (event.eventCode === EventCode.TriggersResolved && event.attributes) {
        eventTypeKey = "✅ Bichard Triggers Resolved"
        eventDetails.push({
          metadata: {
            title: "✅ Bichard Triggers Resolved",
            timestamp: event.timestamp,
            errors: []
          },
          "Resolved by": event.user,
          Triggers: extractTriggersFromAttributes(event.attributes)
        })
      } else if (event.eventCode === EventCode.TriggersDeleted && event.attributes) {
        eventTypeKey = "🗑️ Bichard Triggers Deleted"
        eventDetails.push({
          metadata: {
            title: "🗑️ Bichard Triggers Deleted",
            timestamp: event.timestamp,
            errors: []
          },
          "Deleted by": event.user,
          Triggers: extractTriggersFromAttributes(event.attributes)
        })
      } else if (event.eventCode === EventCode.ExceptionsGenerated && event.attributes) {
        eventTypeKey = "‼️ Bichard Exceptions Generated"
        eventDetails.push({
          metadata: {
            title: "‼️ Bichard Exceptions Generated",
            timestamp: event.timestamp,
            errors: []
          },
          Exceptions: extractExceptionsFromAttributes(event.attributes)
        })
      } else if (event.eventCode.startsWith("hearing-outcome.ignored")) {
        eventTypeKey = "⛔️ Bichard Ignored the Case"
        eventDetails.push({
          metadata: {
            title: "⛔️ Bichard Ignored the Case",
            timestamp: event.timestamp,
            errors: []
          },
          Reason: event.eventCode
            .replace("hearing-outcome.ignored.", "")
            .replace(/\./g, " ")
            .replace(/-/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase())
        })
      }

      if (eventTypeKey) {
        output.eventTypeCount[eventTypeKey] = (output.eventTypeCount[eventTypeKey] ?? 0) + 1
      }
    })
  )

  eventDetails = eventDetails.sort((a, b) =>
    (a as { metadata: Metadata }).metadata.timestamp > (b as { metadata: Metadata }).metadata.timestamp ? 1 : -1
  )

  const formattedEvent = Object.keys(output.eventTypeCount).map((key) => `${key} (${output.eventTypeCount[key]})`)
  const metadata = {
    "Bichard ID": messageId,
    "Exiss correlation id": options.exissCorrelationId.trim(),
    "Source correlation id": options.sourceCorrelationId?.trim(),
    "Sent from": options.systemId,
    "SPI S3 Path": s3Path,
    "Received at": options.receivedDate,
    "Arrest summons number": output.asn,
    "Case ID / PTIURN": options.caseId,
    "PNC / LEDS status": options.pncLedsStatus,
    "Triggers status": options.triggerStatus,
    Events: formattedEvent
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

    const maxKeyLength = Math.max(...Object.keys(summary.metadata).map((key) => key.length))
    const metadata = Object.entries(summary.metadata).reduce((acc: Record<string, unknown>, [key, value]) => {
      acc[key.padEnd(maxKeyLength + 1, " ")] = value
      return acc
    }, {})
    printSummary(metadata)
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
      caseId: item.caseId.S!,
      externalCorrelationId: item.externalCorrelationId.S!,
      externalId: item.externalId?.S,
      systemId: item.systemId?.S,
      triggerStatus: item.triggerStatus.S!,
      pncStatus: item.pncStatus.S!
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
          exissCorrelationId: record.externalCorrelationId,
          sourceCorrelationId: record.externalId,
          systemId: record.systemId,
          triggerStatus: record.triggerStatus,
          pncLedsStatus: record.pncStatus,
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
      caseId: auditLog.caseId,
      exissCorrelationId: auditLog.externalCorrelationId,
      sourceCorrelationId: auditLog.externalId,
      systemId: auditLog.systemId,
      triggerStatus: auditLog.triggerStatus,
      pncLedsStatus: auditLog.pncStatus
    })
  ]
}

export default generateCaseSummary
