import { readFileSync } from "fs"
import parseSpiResult from "src/use-cases/parseSpiResult"
import populateDefendant from "./populateDefendant"
import type { OffencesResult } from "./PopulateOffences"
import PopulateOffences from "./PopulateOffences"

describe("populateDefendant", () => {
  const message = readFileSync("test-data/input-message-001.xml", "utf-8")
  const courtResult = parseSpiResult(message).DeliverRequest.Message.ResultedCaseMessage

  it("should transform SPI Defendant to Hearing Outcome Defendant for individual defendant", () => {
    const result = populateDefendant(courtResult)

    jest.spyOn(PopulateOffences.prototype, "execute").mockReturnValue({} as OffencesResult)
    expect(result).toBeDefined()
    expect(result).toMatchSnapshot()
  })
})
