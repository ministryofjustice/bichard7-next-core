import type BichardResultType from "src/types/BichardResultType"
import type PncGateway from "src/types/PncGateway"
import enrichHearingOutcome from "src/use-cases/enrichHearingOutcome"
import generateExceptions from "src/use-cases/generateExceptions"
import generateTriggers from "src/use-cases/generateTriggers"
import parseSpiResult from "src/use-cases/parseSpiResult"
import transformSpiToAnnotatedHearingOutcome from "src/use-cases/transformSpiToAho"

export default (message: string, pncGateway: PncGateway): BichardResultType => {
  const spiResult = parseSpiResult(message)

  let hearingOutcome = transformSpiToAnnotatedHearingOutcome(spiResult)
  hearingOutcome = enrichHearingOutcome(hearingOutcome, pncGateway)

  const triggers = generateTriggers(hearingOutcome)
  const exceptions = generateExceptions(hearingOutcome)

  return {
    triggers,
    exceptions
  }
}
