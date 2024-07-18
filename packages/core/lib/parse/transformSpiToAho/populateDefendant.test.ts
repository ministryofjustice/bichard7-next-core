import { readFileSync } from "fs"
import parseSpiResult from "../parseSpiResult"
import populateDefendant from "./populateDefendant"
import type { OffencesResult } from "./populateOffences"
import * as populateOffences from "./populateOffences"

describe("populateDefendant", () => {
  const message = readFileSync("phase1/tests/fixtures/input-message-001.xml", "utf-8")
  const courtResult = parseSpiResult(message).DeliverRequest.Message.ResultedCaseMessage

  it("should transform SPI Defendant to Hearing Outcome Defendant for individual defendant", () => {
    const result = populateDefendant(courtResult)

    jest.spyOn(populateOffences, "default").mockReturnValue({} as OffencesResult)
    expect(result).toBeDefined()
    expect(result).toMatchSnapshot()
  })

  it("should remove excess spaces from the given name", () => {
    courtResult.Session.Case.Defendant.CourtIndividualDefendant!.PersonDefendant.BasePersonDetails.PersonName.PersonGivenName1 =
      "John  Smith"
    const result = populateDefendant(courtResult)

    jest.spyOn(populateOffences, "default").mockReturnValue({} as OffencesResult)
    expect(result.DefendantDetail?.PersonName.GivenName).toStrictEqual(["John Smith"])
  })
})
