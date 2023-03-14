import merge from "lodash.merge"
import parseSpiResult from "../../src/parse/parseSpiResult"
import transformSpiToAnnotatedHearingOutcome from "../../src/parse/transformSpiToAho"
import type { AnnotatedHearingOutcome } from "../../src/types/AnnotatedHearingOutcome"
import type { GenerateMessageOptions } from "./generateMessage"
import generateMessage from "./generateMessage"

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
