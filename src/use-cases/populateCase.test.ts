import { readFileSync } from "fs"
import type { HearingDefendant } from "src/types/HearingOutcome"
import parseMessage from "./parseMessage"
import populateCase from "./populateCase"
jest.mock("src/use-cases/populateDefendant")
import populateDefendant from "./populateDefendant"

const message = readFileSync("test-data/input-message-001.xml", "utf-8")
const courtResult = parseMessage(message)

describe("populateCase", () => {
  beforeAll(() => {
    const mockedPopulateDefendant = populateDefendant as jest.MockedFunction<typeof populateDefendant>
    mockedPopulateDefendant.mockReturnValue({} as HearingDefendant)
  })

  it("should transform SPI Case to Hearing Outcome Case", () => {
    const result = populateCase(courtResult)

    expect(result).toBeDefined()
    expect(result).toStrictEqual({
      PTIURN: { value: "01ZD0303208", attributes: undefined },
      PreChargeDecisionIndicator: { value: "N", attributes: { Literal: "No" } },
      CourtReference: {
        MagistratesCourtReference: { value: "01ZD0303208", attributes: undefined }
      },
      HearingDefendant: {}
    })
  })
})
