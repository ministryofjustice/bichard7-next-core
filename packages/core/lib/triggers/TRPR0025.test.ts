import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import type { Offence } from "../../types/AnnotatedHearingOutcome"
import generateAhoFromOffenceList from "../../phase2/tests/fixtures/helpers/generateAhoFromOffenceList"
import TRPR0025 from "./TRPR0025"

const triggerCode = TriggerCode.TRPR0025
const validMatches = [
  { offenceCode: "MC80524", resultCode: 4584 },
  { offenceCode: "MC80527", resultCode: 3049 },
  { offenceCode: "MC80528", resultCode: 3049 }
]

const generateMockAho = (resultCode: number, offenceCode: string) => {
  return generateAhoFromOffenceList([
    {
      Result: [
        {
          CJSresultCode: resultCode
        }
      ],
      CriminalProsecutionReference: {
        OffenceReason: { OffenceCode: { FullCode: offenceCode } }
      },
      CourtOffenceSequenceNumber: 1
    }
  ] as Offence[])
}

describe("TRPR0025", () => {
  validMatches.forEach(({ offenceCode, resultCode }) => {
    it(`should generate a trigger for offenceCode: ${offenceCode} and resultCode: ${resultCode}`, () => {
      const generatedHearingOutcome = generateMockAho(resultCode, offenceCode)
      const result = TRPR0025(generatedHearingOutcome)

      expect(result).toEqual([{ code: triggerCode }])
    })
  })

  it("Should not generate a trigger when offence and result code are in valid matches but not from the same pair", () => {
    const generatedHearingOutcome = generateMockAho(3049, "MC80524")
    const result = TRPR0025(generatedHearingOutcome)

    expect(result).toHaveLength(0)
  })

  it("Should not generate a trigger when offence and result code are not in valid matches", () => {
    const generatedHearingOutcome = generateMockAho(9999, "XXXXXXX")
    const result = TRPR0025(generatedHearingOutcome)

    expect(result).toHaveLength(0)
  })
})
