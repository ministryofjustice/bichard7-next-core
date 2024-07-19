import generateAhoFromOffenceList from "../../phase2/tests/fixtures/helpers/generateAhoFromOffenceList"
import type { AnnotatedHearingOutcome, Offence } from "../../types/AnnotatedHearingOutcome"
import TRPR0008 from "./TRPR0008"

const generateMockAho = (
  offences: { fullCode?: string; verdict: string; pleaStatus: string }[]
): AnnotatedHearingOutcome => {
  return generateAhoFromOffenceList(
    offences.map(
      (offence) =>
        ({
          Result: [{ Verdict: offence.verdict }, { PleaStatus: offence.pleaStatus }],
          CriminalProsecutionReference: {
            OffenceReason: {
              OffenceCode: {
                FullCode: offence.fullCode
              }
            }
          },
          CourtOffenceSequenceNumber: 1
        }) as Offence
    )
  )
}

describe("TRPR0008", () => {
  it("should return a trigger if the fullCode on the offence contains an offence code in offenceCodes array and the result verdict is Guilty", () => {
    const result = TRPR0008(generateMockAho([{ fullCode: "BA76004", verdict: "G", pleaStatus: "NONE" }]))
    expect(result).toEqual([{ code: "TRPR0008" }])
  })

  it("should return a trigger if the fullCode on the offence contains an offence code in offenceCodes array and the result pleaStatus is Admits", () => {
    const result = TRPR0008(generateMockAho([{ fullCode: "BA76004", verdict: "NG", pleaStatus: "ADM" }]))
    expect(result).toEqual([{ code: "TRPR0008" }])
  })

  it("should not return a trigger if offence does not have a fullCode", () => {
    const result = TRPR0008(generateMockAho([{ verdict: "NG", pleaStatus: "ADM" }]))
    expect(result).toEqual([])
  })

  it("should not return a trigger if offence has a fullCode but it does not contain an offence code in offenceCodes array", () => {
    const result = TRPR0008(generateMockAho([{ fullCode: "12345", verdict: "NG", pleaStatus: "NONE" }]))
    expect(result).toEqual([])
  })
  it("should not return a trigger if the fullCode on the offence contains an offence code in offenceCodes array but the result verdict is not Guilty and the pleaStatus is not Admits", () => {
    const result = TRPR0008(generateMockAho([{ fullCode: "BA76005", verdict: "NG", pleaStatus: "NONE" }]))
    expect(result).toEqual([])
  })

  it("should not return multiple triggers for each offence if multiple offences satisfy the conditions", () => {
    const result = TRPR0008(
      generateMockAho([
        { fullCode: "BA76005", verdict: "G", pleaStatus: "ADM" },
        { fullCode: "BA76004", verdict: "G", pleaStatus: "ADM" }
      ])
    )
    expect(result).toEqual([{ code: "TRPR0008" }])
  })

  it("should not return a trigger if there is no offence", () => {
    const result = TRPR0008(generateMockAho([{ fullCode: "BA76005", verdict: "NG", pleaStatus: "NONE" }]))
    expect(result).toEqual([])
  })
})
