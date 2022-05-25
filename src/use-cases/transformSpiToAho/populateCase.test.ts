import { readFileSync } from "fs"
import type { HearingDefendant } from "src/types/AnnotatedHearingOutcome"
import parseSpiResult from "src/use-cases/parseSpiResult"
import populateCase from "./populateCase"
import populateDefendant from "./populateDefendant"

jest.mock("src/use-cases/transformSpiToAho/populateDefendant")

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
