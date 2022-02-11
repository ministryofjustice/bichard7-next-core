import type { ResultedCaseMessageParsedXml } from "src/types/IncomingMessage"
import parseMessage from "src/use-cases/parseMessage"
import fs from "fs"
import TRPR0012 from "."
import { TriggerCode } from "src/types/TriggerCode"

const parseFile = (file: string): ResultedCaseMessageParsedXml => {
  const inputMessage = fs.readFileSync(`test-data/${file}`).toString()
  return parseMessage(inputMessage)
}

describe("TRPR0012", () => {
  it("should generate multiple triggers correctly with multiple offences", () => {
    const data = parseFile("input-message-003.xml")
    const result = TRPR0012(data)
    expect(result).toHaveLength(1)
    expect(result).toStrictEqual([{ code: TriggerCode.TRPR0012 }])
  })

  it("should not generate a trigger correctly", () => {
    const data = parseFile("input-message-001.xml")
    const result = TRPR0012(data)
    expect(result).toHaveLength(0)
  })
})
