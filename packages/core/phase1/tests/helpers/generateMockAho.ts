import merge from "lodash.merge"
import parseSpiResult from "phase1/parse/parseSpiResult"
import transformSpiToAnnotatedHearingOutcome from "phase1/parse/transformSpiToAho"
import type { AnnotatedHearingOutcome } from "types/AnnotatedHearingOutcome"
import type { GenerateMessageOptions } from "phase1/tests/helpers/generateMessage"
import generateMessage from "phase1/tests/helpers/generateMessage"

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
