import convertAhoToXml from "./lib/generateAhoXml"
import type BichardResultType from "./types/BichardResultType"
import type PncGateway from "./types/PncGateway"
import enrichHearingOutcome from "./use-cases/enrichHearingOutcome"
import generateExceptions from "./use-cases/generateExceptions"
import generateTriggers from "./use-cases/generateTriggers"
import parseSpiResult from "./use-cases/parseSpiResult"
import transformSpiToAho from "./use-cases/transformSpiToAho"

export default (message: string, pncGateway: PncGateway): BichardResultType => {
  const spiResult = parseSpiResult(message)

  let hearingOutcome = transformSpiToAho(spiResult)
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
