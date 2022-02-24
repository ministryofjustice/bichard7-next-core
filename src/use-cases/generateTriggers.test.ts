import type { ResultedCaseMessageParsedXml } from "src/types/IncomingMessage"
import parseSpiResult from "./parseSpiResult"
import generateTriggers from "./generateTriggers"
import fs from "fs"
import { TriggerCode } from "src/types/TriggerCode"

const parseFile = (file: string): ResultedCaseMessageParsedXml => {
  const inputMessage = fs.readFileSync(`test-data/${file}`).toString()
  return parseSpiResult(inputMessage).DeliverRequest.Message.ResultedCaseMessage
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
