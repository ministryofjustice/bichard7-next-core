import { readFileSync } from "fs"
import parseSpiResult from "src/use-cases/parseSpiResult"
import enrichCourt from "./enrichCourt"
import transformSpiToAho from "../../transformSpiToAho"

const message = readFileSync("test-data/input-message-001.xml", "utf-8")
const spiResult = parseSpiResult(message)
const aho = transformSpiToAho(spiResult)

describe("enrich court", () => {
  it("should return AHO enriched with court", () => {
    const result = enrichCourt(aho)

    expect(result).toBeDefined()
    expect(result).toMatchSnapshot()
  })
})
