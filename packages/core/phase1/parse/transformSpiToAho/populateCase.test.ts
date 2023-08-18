import { readFileSync } from "fs"
import parseSpiResult from "phase1/parse/parseSpiResult"
import type { HearingDefendant } from "types/AnnotatedHearingOutcome"
import populateCase from "./populateCase"
import populateDefendant from "./populateDefendant"

jest.mock("src/parse/transformSpiToAho/populateDefendant")

const message = readFileSync("test-data/input-message-001.xml", "utf-8")
const courtResult = parseSpiResult(message).DeliverRequest.Message.ResultedCaseMessage

describe("populateCase", () => {
  beforeAll(() => {
    const mockedPopulateDefendant = populateDefendant as jest.MockedFunction<typeof populateDefendant>
    mockedPopulateDefendant.mockReturnValue({} as HearingDefendant)
  })

  it("should transform SPI Case to Hearing Outcome Case", () => {
    const result = populateCase(courtResult)

    expect(result).toBeDefined()
    expect(result).toMatchSnapshot()
  })
})
