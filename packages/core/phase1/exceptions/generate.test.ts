import parseSpiResult from "../../lib/parse/parseSpiResult"
import transformSpiToAho from "../../lib/parse/transformSpiToAho"
import generateExceptions from "../exceptions/generate"
import generateMessage from "../tests/helpers/generateMessage"

const generateAho = () => {
  const spi = generateMessage({
    offences: [
      {
        results: [{ code: 1015 }]
      }
    ]
  })

  return transformSpiToAho(parseSpiResult(spi))
}

describe("getExceptions()", () => {
  it("should raise a HO100100 if an attribute has a bad value", () => {
    const aho = generateAho() as any
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.PTIURN = 123456
    const result = generateExceptions(aho)
    expect(result).toContainEqual({
      code: "HO100100",
      path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "PTIURN"]
    })
  })

  it("should raise a HO100101 if an attribute is required and missing", () => {
    const aho = generateAho() as any
    delete aho.AnnotatedHearingOutcome.HearingOutcome.Case.PTIURN
    const result = generateExceptions(aho)
    expect(result).toContainEqual({
      code: "HO100101",
      path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "PTIURN"]
    })
  })
})
