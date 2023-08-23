import { readFileSync } from "fs"
import parseSpiResult from "phase1/parse/parseSpiResult"
import PopulateOffenceResults from "phase1/parse/transformSpiToAho/PopulateOffenceResults"

describe("PopulateOffenceResults", () => {
  const message = readFileSync("phase1/tests/fixtures/input-message-001.xml", "utf-8")
  const courtResult = parseSpiResult(message).DeliverRequest.Message.ResultedCaseMessage

  it("should transform SPI Offences to Hearing Outcome Offences", () => {
    const result = new PopulateOffenceResults(courtResult, courtResult.Session.Case.Defendant.Offence[0]).execute()

    expect(result).toBeDefined()
    expect(result).toMatchSnapshot()
  })
})
