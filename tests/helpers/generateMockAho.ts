import type { AnnotatedHearingOutcome } from "../../src/types/AnnotatedHearingOutcome"
import parseSpiResult from "../../src/use-cases/parseSpiResult"
import transformSpiToAnnotatedHearingOutcome from "../../src/use-cases/transformSpiToAho"
import type { GenerateMessageOptions } from "./generateMessage"
import generateMessage from "./generateMessage"
import merge from "lodash.merge"

const generateMockAho = (overrides: GenerateMessageOptions = { offences: [] }): AnnotatedHearingOutcome => {
  const options = merge(
    {
      offences: [{ results: [{}] }, { results: [{}] }]
    },
    overrides
  )
  const inputMessage = generateMessage(options)
  const spiResult = parseSpiResult(inputMessage)
  return transformSpiToAnnotatedHearingOutcome(spiResult)
}

export default generateMockAho
