import type { AnnotatedHearingOutcome, Offence } from "../../types/AnnotatedHearingOutcome"

import generateAhoFromOffenceList from "../../phase2/tests/fixtures/helpers/generateAhoFromOffenceList"
import TRPR0008 from "./TRPR0008"

const generateMockAho = (
  offences: { fullCode?: string; pleaStatus: string; verdict: string }[]
): AnnotatedHearingOutcome => {
  return generateAhoFromOffenceList(
    offences.map(
      (offence) =>
        ({
          CourtOffenceSequenceNumber: 1,
          CriminalProsecutionReference: {
            OffenceReason: {
              OffenceCode: {
                FullCode: offence.fullCode
              }
            }
          },
          Result: [{ Verdict: offence.verdict }, { PleaStatus: offence.pleaStatus }]
        }) as Offence
    )
  )
}

describe("TRPR0008", () => {
  it("should return a trigger if the fullCode on the offence contains an offence code in offenceCodes array and the result verdict is Guilty", () => {
    const result = TRPR0008(generateMockAho([{ fullCode: "BA76004", pleaStatus: "NONE", verdict: "G" }]))
    expect(result).toEqual([{ code: "TRPR0008" }])
  })

  it("should return a trigger if the fullCode on the offence contains an offence code in offenceCodes array and the result pleaStatus is Admits", () => {
    const result = TRPR0008(generateMockAho([{ fullCode: "BA76004", pleaStatus: "ADM", verdict: "NG" }]))
    expect(result).toEqual([{ code: "TRPR0008" }])
  })

  it("should not return a trigger if offence does not have a fullCode", () => {
    const result = TRPR0008(generateMockAho([{ pleaStatus: "ADM", verdict: "NG" }]))
    expect(result).toEqual([])
  })

  it("should not return a trigger if offence has a fullCode but it does not contain an offence code in offenceCodes array", () => {
    const result = TRPR0008(generateMockAho([{ fullCode: "12345", pleaStatus: "NONE", verdict: "NG" }]))
    expect(result).toEqual([])
  })
  it("should not return a trigger if the fullCode on the offence contains an offence code in offenceCodes array but the result verdict is not Guilty and the pleaStatus is not Admits", () => {
    const result = TRPR0008(generateMockAho([{ fullCode: "BA76005", pleaStatus: "NONE", verdict: "NG" }]))
    expect(result).toEqual([])
  })

  it("should not return multiple triggers for each offence if multiple offences satisfy the conditions", () => {
    const result = TRPR0008(
      generateMockAho([
        { fullCode: "BA76005", pleaStatus: "ADM", verdict: "G" },
        { fullCode: "BA76004", pleaStatus: "ADM", verdict: "G" }
      ])
    )
    expect(result).toEqual([{ code: "TRPR0008" }])
  })

  it("should not return a trigger if there is no offence", () => {
    const result = TRPR0008(generateMockAho([{ fullCode: "BA76005", pleaStatus: "NONE", verdict: "NG" }]))
    expect(result).toEqual([])
  })
})
