import parseSpiResult from "core/phase1/parse/parseSpiResult"
import { readFileSync } from "fs"
import type { OffencesResult } from "./PopulateOffences"
import PopulateOffences from "./PopulateOffences"
import populateDefendant from "./populateDefendant"

describe("populateDefendant", () => {
  const message = readFileSync("test-data/input-message-001.xml", "utf-8")
  const courtResult = parseSpiResult(message).DeliverRequest.Message.ResultedCaseMessage

  it("should transform SPI Defendant to Hearing Outcome Defendant for individual defendant", () => {
    const result = populateDefendant(courtResult)

    jest.spyOn(PopulateOffences.prototype, "execute").mockReturnValue({} as OffencesResult)
    expect(result).toBeDefined()
    expect(result).toMatchSnapshot()
  })

  it("should remove excess spaces from the given name", () => {
    courtResult.Session.Case.Defendant.CourtIndividualDefendant!.PersonDefendant.BasePersonDetails.PersonName.PersonGivenName1 =
      "John  Smith"
    const result = populateDefendant(courtResult)

    jest.spyOn(PopulateOffences.prototype, "execute").mockReturnValue({} as OffencesResult)
    expect(result.DefendantDetail?.PersonName.GivenName).toStrictEqual(["John Smith"])
  })
})
