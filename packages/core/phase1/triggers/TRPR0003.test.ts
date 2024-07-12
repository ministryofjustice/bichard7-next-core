import generator from "./TRPR0003"
import generateAhoFromOffenceList from "../../phase2/tests/fixtures/helpers/generateAhoFromOffenceList"
import type { AnnotatedHearingOutcome, Offence } from "../../types/AnnotatedHearingOutcome"

const generateMockAho = (offenceResults: number[][]): AnnotatedHearingOutcome =>
  generateAhoFromOffenceList(
    offenceResults.map(
      (offenceResult, index) =>
        ({
          Result: offenceResult.map((result) => ({ CJSresultCode: result })),
          CriminalProsecutionReference: {
            OffenceReason: {
              __type: "NationalOffenceReason"
            }
          },
          CourtOffenceSequenceNumber: index + 1
        }) as Offence
    )
  )

describe("TRPR0003", () => {
  it("should return a trigger if an offence has result codes that exist in the mainResultCodes list", () => {
    const generatedHearingOutcome = generateMockAho([[1100]])
    expect(generator(generatedHearingOutcome)).toEqual([{ code: "TRPR0003", offenceSequenceNumber: 1 }])
  })

  it("should return a trigger if an offence has result codes that exist in the yroResultCodes list and the yroSpeceficRequirementResultCodes list", () => {
    const generatedHearingOutcome = generateMockAho([[1141, 3104]])
    expect(generator(generatedHearingOutcome)).toEqual([{ code: "TRPR0003", offenceSequenceNumber: 1 }])
  })

  it("should not return a trigger if an offence has result codes that do not exist in the mainResultCodes list or the yroResultCodes list, but does exist in the yroSpeceficRequirementResultCodes list", () => {
    const generatedHearingOutcome = generateMockAho([[1234, 3104]])
    expect(generator(generatedHearingOutcome)).toEqual([])
  })

  it("should not return a trigger if an offence has result codes that do not exist in the mainResultCodes list or the yroSpeceficRequirementResultCodes list, but does exist in the yroResultCodes list", () => {
    const generatedHearingOutcome = generateMockAho([[1234, 1142]])
    expect(generator(generatedHearingOutcome)).toEqual([])
  })

  it("should return a single trigger if offence has multiple result codes that exist in mainResultCodes, yroResultCodes, and yroSpeceficRequirementResultCodes lists", () => {
    const generatedHearingOutcome = generateMockAho([[3104, 1142, 1178]])
    expect(generator(generatedHearingOutcome)).toEqual([{ code: "TRPR0003", offenceSequenceNumber: 1 }])
  })

  it("should return multiple triggers when multiple offences have result codes that match the criteria", () => {
    const generatedHearingOutcome = generateMockAho([
      [3041, 1234],
      [1142, 3104]
    ])
    expect(generator(generatedHearingOutcome)).toEqual([
      { code: "TRPR0003", offenceSequenceNumber: 1 },
      { code: "TRPR0003", offenceSequenceNumber: 2 }
    ])
  })

  it("should return the correct number of triggers when multiple offences have result codes that both match and do not match the criteria", () => {
    const generatedHearingOutcome = generateMockAho([[3041, 1234], [1142, 3104], [1234]])
    expect(generator(generatedHearingOutcome)).toEqual([
      { code: "TRPR0003", offenceSequenceNumber: 1 },
      { code: "TRPR0003", offenceSequenceNumber: 2 }
    ])
  })

  it("should not return a trigger if there is no offence", () => {
    const generatedHearingOutcome = generateAhoFromOffenceList([] as Offence[])
    expect(generator(generatedHearingOutcome)).toEqual([])
  })
})
