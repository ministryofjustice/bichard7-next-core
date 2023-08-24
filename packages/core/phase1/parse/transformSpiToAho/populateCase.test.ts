import { readFileSync } from "fs"
import type { HearingDefendant } from "../../../types/AnnotatedHearingOutcome"
import parseSpiResult from "../../parse/parseSpiResult"
import populateCase from "./populateCase"
import populateDefendant from "./populateDefendant"

jest.mock("phase1/parse/transformSpiToAho/populateDefendant")

const message = readFileSync("phase1/tests/fixtures/input-message-001.xml", "utf-8")
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
