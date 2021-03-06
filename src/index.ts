import enrichAho from "./enrichAho"
import generateExceptions from "./exceptions/generate"
import { parseAhoXml } from "./parse/parseAhoXml"
import parseSpiResult from "./parse/parseSpiResult"
import transformSpiToAho from "./parse/transformSpiToAho"
import generateTriggers from "./triggers/generate"
import type { AnnotatedHearingOutcome } from "./types/AnnotatedHearingOutcome"
import type BichardResultType from "./types/BichardResultType"
import type PncGateway from "./types/PncGateway"

export default (message: string, pncGateway: PncGateway): BichardResultType => {
  let hearingOutcome: AnnotatedHearingOutcome | Error

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

  hearingOutcome = enrichAho(hearingOutcome, pncGateway)

  const triggers = generateTriggers(hearingOutcome)
  const exceptions = generateExceptions(hearingOutcome)
  hearingOutcome.Exceptions = (hearingOutcome.Exceptions ?? []).concat(exceptions)

  return {
    triggers,
    hearingOutcome
  }
}
