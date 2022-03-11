import type BichardResultType from "./types/BichardResultType"
import augmentWithPncQuery from "./use-cases/augmentWithPncQuery"
import generateTriggers from "./use-cases/generateTriggers"
import generateExceptions from "./use-cases/generateExceptions"
import parseSpiResult from "./use-cases/parseSpiResult"
import transformSpiToAnnotatedHearingOutcome from "./use-cases/transformSpiToAho"
import type PncGateway from "./types/PncGateway"

export default (message: string, recordable: boolean, pncGateway: PncGateway): BichardResultType => {
  const spiResult = parseSpiResult(message)

  let annotatedHearingOutcome = transformSpiToAnnotatedHearingOutcome(spiResult)
  annotatedHearingOutcome = augmentWithPncQuery(annotatedHearingOutcome, pncGateway)

  const triggers = generateTriggers(annotatedHearingOutcome, recordable)
  const exceptions = generateExceptions(annotatedHearingOutcome)

  return {
    triggers,
    exceptions
  }
}
