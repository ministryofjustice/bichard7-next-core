import convertAhoToXml from "./lib/generateLegacyAhoXml"
import parseAhoXml from "./lib/parseAhoXml"
import type { AnnotatedHearingOutcome } from "./types/AnnotatedHearingOutcome"
import type BichardResultType from "./types/BichardResultType"
import type PncGateway from "./types/PncGateway"
import enrichHearingOutcome from "./use-cases/enrichHearingOutcome"
import generateExceptions from "./use-cases/generateExceptions"
import generateTriggers from "./use-cases/generateTriggers"
import parseSpiResult from "./use-cases/parseSpiResult"
import transformSpiToAho from "./use-cases/transformSpiToAho"

export default (message: string, pncGateway: PncGateway): BichardResultType => {
  let hearingOutcome: AnnotatedHearingOutcome

  if (message.match(/ResultedCaseMessage/)) {
    const spiResult = parseSpiResult(message)
    hearingOutcome = transformSpiToAho(spiResult)
  } else if (message.match(/<br7:HearingOutcome/)) {
    hearingOutcome = parseAhoXml(message)
  } else {
    throw new Error("Valid message not found")
  }

  hearingOutcome = enrichHearingOutcome(hearingOutcome, pncGateway)

  const triggers = generateTriggers(hearingOutcome)
  const exceptions = generateExceptions(hearingOutcome)
  const ahoXml = convertAhoToXml(hearingOutcome)

  return {
    triggers,
    exceptions,
    ahoXml
  }
}
