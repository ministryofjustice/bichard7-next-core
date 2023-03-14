import { isError } from "./comparison/types/Result"
import enrichAho from "./enrichAho"
import addExceptionsToAho from "./exceptions/addExceptionsToAho"
import generateExceptions from "./exceptions/generate"
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
import type Phase1Result from "./types/Phase1Result"
import { Phase1ResultType } from "./types/Phase1Result"
import type PncGatewayInterface from "./types/PncGatewayInterface"

export default async (
  message: string,
  pncGateway: PncGatewayInterface,
  auditLogger: AuditLogger
): Promise<Phase1Result> => {
  try {
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
    const correlationId = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID

    if (hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.length === 0) {
      auditLogger.logEvent(
        getAuditLogEvent(
          "hearing-outcome.ignored.no-offences",
          "information",
          "Hearing Outcome ignored as it contains no offences",
          "CoreHandler",
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

    hearingOutcome = await enrichAho(hearingOutcome, pncGateway, auditLogger)

    auditLogger.logEvent(
      getIncomingMessageLog(hearingOutcome.AnnotatedHearingOutcome.HearingOutcome, message, messageType)
    )

    if (isError(hearingOutcome)) {
      throw hearingOutcome
    }
    const triggers = generateTriggers(hearingOutcome)
    const exceptions = generateExceptions(hearingOutcome)

    exceptions.forEach(({ code, path }) => {
      addExceptionsToAho(hearingOutcome as AnnotatedHearingOutcome, code, path)
    })

    const isIgnored = isReopenedOrStatutoryDeclarationCase(hearingOutcome)
    let resultType: Phase1ResultType
    if (isIgnored) {
      auditLogger.logEvent(
        getAuditLogEvent(
          "hearing-outcome.ignored.reopened",
          "information",
          "Re-opened / Statutory Declaration case ignored",
          "CoreHandler",
          {}
        )
      )
      resultType = Phase1ResultType.ignored
    } else {
      if (hearingOutcome.Exceptions.length > 0) {
        auditLogger.logEvent(getExceptionsGeneratedLog(hearingOutcome))
      }
      if (triggers.length > 0) {
        auditLogger.logEvent(getTriggersGeneratedLog(triggers, hearingOutcome.Exceptions.length > 0))
      }
      resultType = hearingOutcome.Exceptions.length > 0 ? Phase1ResultType.exceptions : Phase1ResultType.success
    }

    return {
      correlationId,
      triggers,
      hearingOutcome,
      auditLogEvents: auditLogger.getEvents(),
      resultType
    }
  } catch (e) {
    const { message: errorMessage, stack } = e as Error

    auditLogger.logEvent(
      getAuditLogEvent("message-rejected", "error", "Message Rejected by CoreHandler", "CoreHandler", {
        "Exception Message": errorMessage,
        "Exception Stack Trace": stack
      })
    )

    return {
      auditLogEvents: auditLogger.getEvents(),
      resultType: Phase1ResultType.failure
    }
  }
}
