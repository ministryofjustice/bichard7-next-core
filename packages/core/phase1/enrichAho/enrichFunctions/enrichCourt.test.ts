import { readFileSync } from "fs"
import parseSpiResult from "../../parse/parseSpiResult"
import transformSpiToAho from "../../parse/transformSpiToAho"
import enrichCourt from "./enrichCourt"

const message = readFileSync("phase1/tests/fixtures/input-message-001.xml", "utf-8")
const spiResult = parseSpiResult(message)
const aho = transformSpiToAho(spiResult)

describe("enrich court", () => {
  it("should return AHO enriched with court", () => {
    const result = enrichCourt(aho)

    expect(result).toBeDefined()
    expect(result).toMatchSnapshot()
  })
})
