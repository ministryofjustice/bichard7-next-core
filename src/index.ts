import type BichardResultType from "./types/BichardResultType"
import generateTriggers from "./use-cases/generateTriggers"
import generateExceptions from "./use-cases/generateExceptions"
import parseSpiResult from "./use-cases/parseSpiResult"
import transformSpiToAnnotatedHearingOutcome from "./use-cases/transformSpiToAho"

export default (message: string, recordable: boolean): BichardResultType => {
  const spiResult = parseSpiResult(message)

  const triggers = generateTriggers(spiResult.DeliverRequest.Message.ResultedCaseMessage, recordable)

  const annotatedHearingOutcome = transformSpiToAnnotatedHearingOutcome(spiResult)

  const exceptions = generateExceptions(annotatedHearingOutcome)

  return {
    triggers,
    exceptions
  }
}
