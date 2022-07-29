import { readFileSync } from "fs"
import parseSpiResult from "../../parse/parseSpiResult"
import PopulateOffenceResults from "./PopulateOffenceResults"

describe("PopulateOffenceResults", () => {
  const message = readFileSync("test-data/input-message-001.xml", "utf-8")
  const courtResult = parseSpiResult(message).DeliverRequest.Message.ResultedCaseMessage

  it("should transform SPI Offences to Hearing Outcome Offences", () => {
    const result = new PopulateOffenceResults(courtResult, courtResult.Session.Case.Defendant.Offence[0]).execute()

    expect(result).toBeDefined()
    expect(result).toMatchSnapshot()
  })
})
