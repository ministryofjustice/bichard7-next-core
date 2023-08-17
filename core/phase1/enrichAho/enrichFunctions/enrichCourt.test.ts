import parseSpiResult from "core/phase1/parse/parseSpiResult"
import transformSpiToAho from "core/phase1/parse/transformSpiToAho"
import { readFileSync } from "fs"
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
