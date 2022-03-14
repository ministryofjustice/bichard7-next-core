import fs from "fs"
import type { AnnotatedHearingOutcome } from "../types/AnnotatedHearingOutcome"
import { TriggerCode } from "../types/TriggerCode"
import generateTriggers from "./generateTriggers"
import parseSpiResult from "./parseSpiResult"
import transformSpiToAho from "./transformSpiToAho"

const parseFile = (file: string): AnnotatedHearingOutcome => {
  const inputMessage = fs.readFileSync(`test-data/${file}`).toString()
  return transformSpiToAho(parseSpiResult(inputMessage))
}

describe("generateTriggers", () => {
  it("should generate multiple triggers", () => {
    const data = parseFile("input-message-003.xml")
    const result = generateTriggers(data, true)
    expect(result).toHaveLength(4)
    expect(result).toStrictEqual([
      { code: TriggerCode.TRPR0001, offenceSequenceNumber: 1 },
      { code: TriggerCode.TRPR0001, offenceSequenceNumber: 3 },
      { code: TriggerCode.TRPR0006 },
      { code: TriggerCode.TRPR0012 }
    ])
  })
})
