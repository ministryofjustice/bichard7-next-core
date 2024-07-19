import { readFileSync } from "fs"
import parseSpiResult from "../parseSpiResult"
import populateOffences from "./populateOffences"

describe("PopulateOffences", () => {
  it("should transform SPI Offences to Hearing Outcome Offences", () => {
    const message = readFileSync("phase1/tests/fixtures/input-message-001-variations.xml", "utf-8")
    const courtResult = parseSpiResult(message).DeliverRequest.Message.ResultedCaseMessage
    const result = populateOffences(courtResult)

    expect(result).toBeDefined()
    expect(result).toMatchSnapshot()
  })

  it("should handle adjournment sine die results by setting the conviction date on offences", () => {
    const message = readFileSync("phase1/tests/fixtures/input-message-001-sine-die.xml", "utf-8")
    const courtResult = parseSpiResult(message).DeliverRequest.Message.ResultedCaseMessage
    const result = populateOffences(courtResult)

    expect(result).toBeDefined()
    expect(result.offences[0].ConvictionDate).toBeUndefined()
    expect(result.offences[1].ConvictionDate).toStrictEqual(new Date("2011-09-26"))
    expect(result.offences[2].ConvictionDate).toStrictEqual(new Date("2011-09-26"))
  })

  it("should add bail conditions for bail qualifiers in results", () => {
    const message = readFileSync("phase1/tests/fixtures/input-message-001-bail-qualifiers.xml", "utf-8")
    const courtResult = parseSpiResult(message).DeliverRequest.Message.ResultedCaseMessage
    const result = populateOffences(courtResult)

    expect(result).toBeDefined()
    expect(result.bailConditions).toStrictEqual(["With Electronic Tagging"])
  })
})
