import type { Offence } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"

import generateAhoFromOffenceList from "../../phase2/tests/fixtures/helpers/generateAhoFromOffenceList"
import TRPR0031 from "./TRPR0031"

const triggerCode = TriggerCode.TRPR0031
const resultCodes = [1030, 1032, 1115, 1116, 1134, 1507, 1508, 4575, 4576, 4577]

const generateMockAho = (resultCode: number) => {
  return generateAhoFromOffenceList([
    {
      Result: [
        {
          CJSresultCode: resultCode
        }
      ]
    }
  ] as Offence[])
}

describe("TRPR0031", () => {
  it.each(resultCodes)("should generate a trigger for resultCode: %s", (resultCode) => {
    const generatedHearingOutcome = generateMockAho(resultCode)
    const result = TRPR0031(generatedHearingOutcome)

    expect(result).toEqual([{ code: triggerCode }])
  })

  it("should not generate a trigger for a result code not covered by this trigger", () => {
    const generatedHearingOutcome = generateMockAho(1)
    const result = TRPR0031(generatedHearingOutcome)

    expect(result).toEqual([])
  })
})
