import { readFileSync } from "fs"
import parseSpiResult from "src/use-cases/parseSpiResult"
import enrichCase from "./enrichCase"
import transformSpiToAho from "../../transformSpiToAho"

const message = readFileSync("test-data/input-message-001.xml", "utf-8")
const spiResult = parseSpiResult(message)
const aho = transformSpiToAho(spiResult)

describe("enrich case", () => {
  it("should return AHO enriched with case", () => {
    const result = enrichCase(aho)

    expect(result).toBeDefined()
    expect(result).toMatchSnapshot()
  })
})
