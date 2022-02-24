import { readFileSync } from "fs"
import type { Offence } from "src/types/HearingOutcome"
import parseMessage from "./parseMessage"
import populateDefendant from "./populateDefendant"
import PopulateOffences from "./PopulateOffences"

describe("populateDefendant", () => {
  const message = readFileSync("test-data/input-message-001.xml", "utf-8")
  const courtResult = parseMessage(message)

  it("should transform SPI Defendant to Hearing Outcome Defendant for individual defendant", () => {
    const result = populateDefendant(courtResult)

    jest.spyOn(PopulateOffences.prototype, "execute").mockReturnValue({} as Offence[])
    expect(result).toBeDefined()
    expect(result).toMatchSnapshot()
  })
})
