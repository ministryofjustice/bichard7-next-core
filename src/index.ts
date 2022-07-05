import parseAhoXml from "./parse/parseAhoXml"
import parseSpiResult from "./parse/parseSpiResult"
import transformSpiToAho from "./parse/transformSpiToAho"
import type { AnnotatedHearingOutcome } from "./types/AnnotatedHearingOutcome"
import type BichardResultType from "./types/BichardResultType"
import type PncGateway from "./types/PncGateway"
import enrichHearingOutcome from "./use-cases/enrichHearingOutcome"
import generateExceptions from "./use-cases/generateExceptions"
import generateTriggers from "./use-cases/generateTriggers"

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

  hearingOutcome = enrichHearingOutcome(hearingOutcome, pncGateway)

  const triggers = generateTriggers(hearingOutcome)
  const exceptions = generateExceptions(hearingOutcome)
  hearingOutcome.Exceptions = (hearingOutcome.Exceptions ?? []).concat(exceptions)

  return {
    triggers,
    hearingOutcome
  }
}
