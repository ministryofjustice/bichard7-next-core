import { readFileSync } from "fs"
import parseSpiResult from "src/use-cases/parseSpiResult"
import populateCourt from "./populateCourt"
import transformSpiToAho from "../../transformSpiToAho"

const message = readFileSync("test-data/input-message-001.xml", "utf-8")
const spiResult = parseSpiResult(message)
const aho = transformSpiToAho(spiResult)

describe("populate court", () => {
  it("should return enriched AHO with court populated", () => {
    const result = populateCourt(aho)

    expect(result).toBeDefined()
    expect(result).toMatchSnapshot()
  })
})
