import enrichAho from "./enrichAho"
import generateExceptions from "./exceptions/generate"
import { parseAhoXml } from "./parse/parseAhoXml"
import parseSpiResult from "./parse/parseSpiResult"
import transformSpiToAho from "./parse/transformSpiToAho"
import generateTriggers from "./triggers/generate"
import type { AnnotatedHearingOutcome } from "./types/AnnotatedHearingOutcome"
import type AuditLogger from "./types/AuditLogger"
import type BichardResultType from "./types/BichardResultType"
import type PncGateway from "./types/PncGateway"
import getIncomingMessageLog from "./lib/auditLog/getIncomingMessageLog"
import getMessageType from "./lib/getMessageType"
import getAuditLogEvent from "./lib/auditLog/getAuditLogEvent"

export default (message: string, pncGateway: PncGateway, auditLogger: AuditLogger): BichardResultType => {
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

  if (hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.length === 0) {
    auditLogger.logEvent(
      getAuditLogEvent("information", "Hearing Outcome ignored as it contains no offences", "CoreHandler", {
        ASN: hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber
      })
    )

    return {
      triggers: [],
      hearingOutcome,
      events: auditLogger.finish().getEvents()
    }
  }

  auditLogger.logEvent(
    getIncomingMessageLog(hearingOutcome.AnnotatedHearingOutcome.HearingOutcome, message, messageType)
  )

  hearingOutcome = enrichAho(hearingOutcome, pncGateway, auditLogger)
  const triggers = generateTriggers(hearingOutcome)
  const exceptions = generateExceptions(hearingOutcome)
  hearingOutcome.Exceptions = (hearingOutcome.Exceptions ?? []).concat(exceptions)

  return {
    triggers,
    hearingOutcome,
    events: auditLogger.finish().getEvents()
  }
}
