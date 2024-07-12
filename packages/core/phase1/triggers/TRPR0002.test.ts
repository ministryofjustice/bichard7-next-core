import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import generateAhoFromOffenceList from "../../phase2/tests/fixtures/helpers/generateAhoFromOffenceList"
import type { Offence } from "../../types/AnnotatedHearingOutcome"
import TRPR0002 from "./TRPR0002"

describe("TRPR0002", () => {
  it.each([4575, 4576, 4577, 4585, 4586])(
    "should raise a trigger if result code equals %i and does not have a result qualifier code of EO",
    (resultCode) => {
      const generatedHearingOutcome = generateAhoFromOffenceList([
        {
          Result: [
            {
              CJSresultCode: resultCode,
              ResultQualifierVariable: [{ Code: "ZZ" }]
            },
            {
              CJSresultCode: 9999,
              ResultQualifierVariable: [{ Code: "EO" }]
            }
          ]
        }
      ] as Offence[])

      const result = TRPR0002(generatedHearingOutcome)

      expect(result).toEqual([{ code: TriggerCode.TRPR0002 }])
    }
  )

  it.each([4575, 4576, 4577, 4585, 4586])(
    "should not raise a trigger if result code equals %i and has a result qualifier code of EO",
    (resultCode) => {
      const generatedHearingOutcome = generateAhoFromOffenceList([
        {
          Result: [
            {
              CJSresultCode: resultCode,
              ResultQualifierVariable: [{ Code: "AA" }, { Code: "EO" }]
            },
            {
              CJSresultCode: 9999,
              ResultQualifierVariable: [{ Code: "EO" }]
            }
          ]
        }
      ] as Offence[])

      const result = TRPR0002(generatedHearingOutcome)

      expect(result).toHaveLength(0)
    }
  )
})
