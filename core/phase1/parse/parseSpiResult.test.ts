import parseSpiResult from "core/phase1/parse/parseSpiResult"
import type { ResultedCaseMessageParsedXml } from "core/phase1/types/SpiResult"
import fs from "fs"

const parseFile = (file: string): ResultedCaseMessageParsedXml => {
  const inputMessage = fs.readFileSync(file).toString()
  return parseSpiResult(inputMessage).DeliverRequest.Message.ResultedCaseMessage
}

describe("core/phase1/types/SpiResult", () => {
  it("should handle messages with multiple offences", () => {
    const result = parseFile("test-data/input-message-001.xml")
    expect(Array.isArray(result.Session.Case.Defendant.Offence)).toBe(true)
    expect(result.Session.Case.Defendant.Offence).toHaveLength(3)
  })

  it("should handle messages with single offences", () => {
    const result = parseFile("test-data/input-message-010b.xml")
    expect(Array.isArray(result.Session.Case.Defendant.Offence)).toBe(true)
    expect(result.Session.Case.Defendant.Offence).toHaveLength(1)
  })

  it("should handle messages with no offences", () => {
    const result = parseFile("test-data/input-message-no-offences.xml")
    expect(Array.isArray(result.Session.Case.Defendant.Offence)).toBe(true)
    expect(result.Session.Case.Defendant.Offence).toHaveLength(0)
  })

  it("should handle offences with multiple results", () => {
    const result = parseFile("test-data/input-message-003.xml")
    const offence = result.Session.Case.Defendant.Offence[0]
    expect(Array.isArray(offence.Result)).toBe(true)
    expect(offence.Result).toHaveLength(2)
  })

  it("should handle offences with single results", () => {
    const result = parseFile("test-data/input-message-001.xml")
    const offence = result.Session.Case.Defendant.Offence[0]
    expect(Array.isArray(offence.Result)).toBe(true)
    expect(offence.Result).toHaveLength(1)
  })

  it("should handle offences with no results", () => {
    const result = parseFile("test-data/input-message-no-results.xml")
    const offence = result.Session.Case.Defendant.Offence[0]
    expect(Array.isArray(offence.Result)).toBe(true)
    expect(offence.Result).toHaveLength(0)
  })
})
