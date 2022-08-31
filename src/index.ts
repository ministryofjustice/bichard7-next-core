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

export default (message: string, pncGateway: PncGateway, auditLogger: AuditLogger): BichardResultType => {
  let hearingOutcome: AnnotatedHearingOutcome | Error
  auditLogger.start("Phase 1 Processing")

  if (message.match(/ResultedCaseMessage/)) {
    const spiResult = parseSpiResult(message)
    hearingOutcome = transformSpiToAho(spiResult)
  } else if (message.match(/<br7:HearingOutcome/) || message.match(/<br7:AnnotatedHearingOutcome/)) {
    hearingOutcome = parseAhoXml(message)
  } else {
    throw new Error("Invalid incoming message format")
  }
  if (hearingOutcome instanceof Error) {
    throw hearingOutcome
  }

  if (hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.length === 0) {
    return {
      triggers: [],
      hearingOutcome,
      events: auditLogger.finish().getEvents()
    }
  }

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
