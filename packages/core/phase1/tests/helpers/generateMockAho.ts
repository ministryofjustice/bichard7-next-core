import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import parseSpiResult from "@moj-bichard7/common/aho/parse/parseSpiResult"
import transformSpiToAnnotatedHearingOutcome from "@moj-bichard7/common/aho/parse/transformSpiToAho/index"
import merge from "lodash.merge"

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
