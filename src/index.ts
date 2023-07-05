import { isError } from "./comparison/types/Result"
import enrichAho from "./enrichAho"
import addExceptionsToAho from "./exceptions/addExceptionsToAho"
import generateExceptions from "./exceptions/generate"
import addNullElementsForExceptions from "./lib/addNullElementsForExceptions"
import getAuditLogEvent from "./lib/auditLog/getAuditLogEvent"
import getExceptionsGeneratedLog from "./lib/auditLog/getExceptionsGeneratedLog"
import getIncomingMessageLog from "./lib/auditLog/getIncomingMessageLog"
import getTriggersGeneratedLog from "./lib/auditLog/getTriggersGeneratedLog"
import getMessageType from "./lib/getMessageType"
import isReopenedOrStatutoryDeclarationCase from "./lib/isReopenedOrStatutoryDeclarationCase"
import { parseAhoXml } from "./parse/parseAhoXml"
import parseSpiResult from "./parse/parseSpiResult"
import transformSpiToAho from "./parse/transformSpiToAho"
import generateTriggers from "./triggers/generate"
import type { AnnotatedHearingOutcome } from "./types/AnnotatedHearingOutcome"
import type AuditLogger from "./types/AuditLogger"
import { AuditLogEventSource, AuditLogEventOptions } from "./types/AuditLogEvent"
import EventCategory from "./types/EventCategory"
import type Phase1Result from "./types/Phase1Result"
import { Phase1ResultType } from "./types/Phase1Result"
import type PncGatewayInterface from "./types/PncGatewayInterface"

export const parseIncomingMessage = (message: string): [AnnotatedHearingOutcome, string] => {
  let hearingOutcome: AnnotatedHearingOutcome | Error
  const messageType = getMessageType(message)

  if (messageType === "SPIResults") {
    const spiResult = parseSpiResult(message)
    hearingOutcome = transformSpiToAho(spiResult)
  } else if (messageType === "HearingOutcome") {
    hearingOutcome = parseAhoXml(message)
  } else {
    throw new Error("Invalid incoming message format")
  }

  if (hearingOutcome instanceof Error) {
    throw hearingOutcome
  }

  return [hearingOutcome, messageType]
}

export default async (
  message: string,
  pncGateway: PncGatewayInterface,
  auditLogger: AuditLogger
): Promise<Phase1Result> => {
  try {
    const [hearingOutcome, messageType] = parseIncomingMessage(message)
    const correlationId = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID

    if (hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.length === 0) {
      auditLogger.logEvent(
        getAuditLogEvent(
          AuditLogEventOptions.HEARING_OUTCOME_IGNORED_NO_OFFENCES,
          EventCategory.information,
          AuditLogEventSource.CoreHandler,
          {
            ASN: hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber
          }
        )
      )

      return {
        correlationId,
        hearingOutcome,
        triggers: [],
        auditLogEvents: auditLogger.getEvents(),
        resultType: Phase1ResultType.ignored
      }
    }

    const enrichedHearingOutcome = await enrichAho(hearingOutcome, pncGateway, auditLogger)

    auditLogger.logEvent(
      getIncomingMessageLog(enrichedHearingOutcome.AnnotatedHearingOutcome.HearingOutcome, message, messageType)
    )

    if (isError(enrichedHearingOutcome)) {
      throw enrichedHearingOutcome
    }
    const triggers = generateTriggers(enrichedHearingOutcome)
    const exceptions = generateExceptions(enrichedHearingOutcome)

    exceptions.forEach(({ code, path }) => {
      addExceptionsToAho(enrichedHearingOutcome as AnnotatedHearingOutcome, code, path)
    })

    addNullElementsForExceptions(enrichedHearingOutcome)

    const isIgnored = isReopenedOrStatutoryDeclarationCase(enrichedHearingOutcome)
    let resultType: Phase1ResultType
    if (isIgnored) {
      auditLogger.logEvent(
        getAuditLogEvent(
          AuditLogEventOptions.HEARING_OUTCOME_IGNORED_REOPENED,
          EventCategory.information,
          AuditLogEventSource.CoreHandler,
          {}
        )
      )
      resultType = Phase1ResultType.ignored
    } else {
      if (enrichedHearingOutcome.Exceptions.length > 0) {
        auditLogger.logEvent(getExceptionsGeneratedLog(enrichedHearingOutcome))
      }
      if (triggers.length > 0) {
        auditLogger.logEvent(getTriggersGeneratedLog(triggers, enrichedHearingOutcome.Exceptions.length > 0))
      }
      resultType = enrichedHearingOutcome.Exceptions.length > 0 ? Phase1ResultType.exceptions : Phase1ResultType.success
    }

    return {
      correlationId,
      triggers,
      hearingOutcome: enrichedHearingOutcome,
      auditLogEvents: auditLogger.getEvents(),
      resultType
    }
  } catch (e) {
    const { message: errorMessage, stack } = e as Error

    auditLogger.logEvent(
      getAuditLogEvent(
        AuditLogEventOptions.MESSAGE_REJECTED_BY_CORE_HANDLER,
        EventCategory.error,
        AuditLogEventSource.CoreHandler,
        {
          "Exception Message": errorMessage,
          "Exception Stack Trace": stack
        }
      )
    )

    return {
      auditLogEvents: auditLogger.getEvents(),
      resultType: Phase1ResultType.failure
    }
  }
}
