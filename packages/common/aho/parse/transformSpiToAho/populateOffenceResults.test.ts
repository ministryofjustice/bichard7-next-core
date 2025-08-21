import { readFileSync } from "fs"
import path from "path"

import parseSpiResult from "../parseSpiResult"
import populateOffenceResults from "./populateOffenceResults"

describe("populateOffenceResults", () => {
  const message = readFileSync(path.resolve(__dirname, "../fixtures/input-message-001-variations.xml"), "utf-8")
  const courtResult = parseSpiResult(message).DeliverRequest.Message.ResultedCaseMessage

  it("should transform SPI Offences to Hearing Outcome Offences", () => {
    const result = populateOffenceResults(courtResult.Session.Case.Defendant.Offence[0], courtResult)

    expect(result).toBeDefined()
    expect(result).toMatchSnapshot()
  })
})
