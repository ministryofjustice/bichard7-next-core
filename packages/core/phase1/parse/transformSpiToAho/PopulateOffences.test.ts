import { readFileSync } from "fs"
import parseSpiResult from "phase1/parse/parseSpiResult"
import PopulateOffences from "./PopulateOffences"

describe("PopulateOffences", () => {
  const message = readFileSync("test-data/input-message-001.xml", "utf-8")
  const courtResult = parseSpiResult(message).DeliverRequest.Message.ResultedCaseMessage

  it("should transform SPI Offences to Hearing Outcome Offences", () => {
    const result = new PopulateOffences(courtResult, []).execute()

    expect(result).toBeDefined()
    expect(result).toMatchSnapshot()
  })
})
