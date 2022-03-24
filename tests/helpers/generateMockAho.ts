import type { AnnotatedHearingOutcome } from "../../src/types/AnnotatedHearingOutcome"
import parseSpiResult from "../../src/use-cases/parseSpiResult"
import transformSpiToAnnotatedHearingOutcome from "../../src/use-cases/transformSpiToAho"
import generateMessage from "./generateMessage"

const generateMockAho = (): AnnotatedHearingOutcome => {
  const inputMessage = generateMessage({
    offences: [{ results: [{}] }, { results: [{}] }]
  })
  const spiResult = parseSpiResult(inputMessage)
  return transformSpiToAnnotatedHearingOutcome(spiResult)
}

export default generateMockAho
