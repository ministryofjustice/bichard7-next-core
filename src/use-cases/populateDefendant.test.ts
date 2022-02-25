import { readFileSync } from "fs"
import type { Offence } from "src/types/AnnotatedHearingOutcome"
import parseSpiResult from "./parseSpiResult"
import populateDefendant from "./populateDefendant"
import PopulateOffences from "./PopulateOffences"

describe("populateDefendant", () => {
  const message = readFileSync("test-data/input-message-001.xml", "utf-8")
  const courtResult = parseSpiResult(message).DeliverRequest.Message.ResultedCaseMessage

  it("should transform SPI Defendant to Hearing Outcome Defendant for individual defendant", () => {
    const result = populateDefendant(courtResult)

    jest.spyOn(PopulateOffences.prototype, "execute").mockReturnValue({} as Offence[])
    expect(result).toBeDefined()
    expect(result).toMatchSnapshot()
  })
})
