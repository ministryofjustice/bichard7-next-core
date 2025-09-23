import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import generateCheckName from "./generateCheckName"

const generateAho = (familyName: string) =>
  ({
    AnnotatedHearingOutcome: {
      HearingOutcome: {
        Case: {
          HearingDefendant: {
            DefendantDetail: {
              PersonName: {
                FamilyName: familyName
              }
            }
          }
        }
      }
    }
  }) as unknown as AnnotatedHearingOutcome

describe("generateCheckName", () => {
  it("should generate check name", () => {
    const aho = generateAho("Dummy Family Name")

    const checkName = generateCheckName(aho)

    expect(checkName).toBe("Dummy Family Name")
  })

  it("should truncate the name", () => {
    const aho = generateAho("Very long family name ".repeat(20))

    const checkName = generateCheckName(aho)

    expect(checkName).toBe("Very long family name Very long family name Very long")
  })

  it("should remove leading and trailing white spaces from the name", () => {
    const aho = generateAho("  Dummy Family Name  ")

    const checkName = generateCheckName(aho)

    expect(checkName).toBe("Dummy Family Name")
  })

  it("should return empty string when defendant detail does not exist", () => {
    const aho = generateAho("Dummy Family Name")
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.DefendantDetail = undefined

    const checkName = generateCheckName(aho)

    expect(checkName).toBe("")
  })
})
