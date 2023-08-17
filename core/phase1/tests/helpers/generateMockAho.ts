import type { AnnotatedHearingOutcome } from "core/common/types/AnnotatedHearingOutcome"
import parseSpiResult from "core/phase1/parse/parseSpiResult"
import transformSpiToAnnotatedHearingOutcome from "core/phase1/parse/transformSpiToAho"
import merge from "lodash.merge"
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
