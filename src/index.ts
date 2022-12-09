import { isError } from "./comparison/types/Result"
import enrichAho from "./enrichAho"
import addExceptionsToAho from "./exceptions/addExceptionsToAho"
import generateExceptions from "./exceptions/generate"
import getAuditLogEvent from "./lib/auditLog/getAuditLogEvent"
import getHearingOutcomePassedToErrorListLog from "./lib/auditLog/getHearingOutcomePassedToErrorListLog"
import getIncomingMessageLog from "./lib/auditLog/getIncomingMessageLog"
import getMessageType from "./lib/getMessageType"
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
    auditLogger.start("Phase 1 Processing")
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
      hearingOutcome.Ignored = true

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
        triggers: [],
        hearingOutcome,
        auditLogEvents: auditLogger.finish().getEvents(),
        resultType: Phase1ResultType.success
      }
    }

    auditLogger.logEvent(
      getIncomingMessageLog(hearingOutcome.AnnotatedHearingOutcome.HearingOutcome, message, messageType)
    )

    hearingOutcome = await enrichAho(hearingOutcome, pncGateway, auditLogger)
    if (isError(hearingOutcome)) {
      throw hearingOutcome
    }
    const triggers = generateTriggers(hearingOutcome)
    const exceptions = generateExceptions(hearingOutcome)

    exceptions.forEach(({ code, path }) => {
      addExceptionsToAho(hearingOutcome as AnnotatedHearingOutcome, code, path)
    })

    if (hearingOutcome.Exceptions.length > 0) {
      auditLogger.logEvent(getHearingOutcomePassedToErrorListLog(hearingOutcome))
    }

    return {
      correlationId,
      triggers,
      hearingOutcome,
      auditLogEvents: auditLogger.finish().getEvents(),
      resultType: Phase1ResultType.success
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
      auditLogEvents: auditLogger.finish().getEvents(),
      resultType: Phase1ResultType.failure
    }
  }
}
