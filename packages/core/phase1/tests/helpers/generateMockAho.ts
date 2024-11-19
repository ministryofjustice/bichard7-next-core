import merge from "lodash.merge"
import parseSpiResult from "../../../lib/parse/parseSpiResult"
import transformSpiToAnnotatedHearingOutcome from "../../../lib/parse/transformSpiToAho"
import type { AnnotatedHearingOutcome } from "../../../types/AnnotatedHearingOutcome"
import type { GenerateMessageOptions } from "../../tests/helpers/generateMessage"
import generateMessage from "../../tests/helpers/generateMessage"

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
