import type { Offence } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/types/TriggerCode"

import generateAhoFromOffenceList from "../../phase2/tests/fixtures/helpers/generateAhoFromOffenceList"
import TRPR0031 from "./TRPR0031"

const triggerCode = TriggerCode.TRPR0031
const reasonCodes = [1030, 1032, 1115, 1116, 1134, 1507, 1508, 4575, 4576, 4577]

const generateMockAho = (resultCode: number) => {
  return generateAhoFromOffenceList([
    {
      Result: [
        {
          CJSresultCode: resultCode
        }
      ],
      CourtOffenceSequenceNumber: 1
    }
  ] as Offence[])
}

describe("TRPR0031", () => {
  it.each(reasonCodes)("Should generate a trigger when case has a reason code of %s", (reasonCode) => {
    const result = TRPR0031(generateMockAho(reasonCode))
    expect(result).toEqual([{ code: triggerCode }])
  })

  it("Should not generate a trigger when case has a reason code that is not from the list", () => {
    const result = TRPR0031(generateMockAho(9999))
    expect(result).toHaveLength(0)
  })
})
