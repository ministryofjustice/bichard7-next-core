import { readFileSync } from "fs"
import parseSpiResult from "src/parse/parseSpiResult"
import transformSpiToAho from "src/parse/transformSpiToAho"
import enrichCourt from "./enrichCourt"

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
