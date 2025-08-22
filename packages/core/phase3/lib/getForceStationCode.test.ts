import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import getForceStationCode from "./getForceStationCode"

const getForceOwner = (secondLevelCode: string, thirdLevelCode: string): AnnotatedHearingOutcome => {
  const aho = {
    Exceptions: [],
    AnnotatedHearingOutcome: {
      HearingOutcome: {
        Case: {
          ForceOwner: {
            SecondLevelCode: secondLevelCode,
            ThirdLevelCode: thirdLevelCode
          }
        }
      }
    }
  } as unknown as AnnotatedHearingOutcome
  return aho
}

describe("getForceStationCode", () => {
  it("Should use the default third level code 'YZ' if useSpecialStationCode is set to true", () => {
    const aho = getForceOwner("05", "")

    const useSpecialStationCode = true
    const forceStationCode = getForceStationCode(aho, useSpecialStationCode)

    expect(forceStationCode).toBe("05YZ")
  })

  it("Should use the force owners third level code if useSpecialStationCode is set to false", () => {
    const aho = getForceOwner("24", "ZD")

    const useSpecialStationCode = false
    const forceStationCode = getForceStationCode(aho, useSpecialStationCode)

    expect(forceStationCode).toBe("24ZD")
  })

  it("Should return '0000' if the secondLevelCode is not present", () => {
    const aho = getForceOwner("", "AB")

    const useSpecialStationCode = false
    const forceStationCode = getForceStationCode(aho, useSpecialStationCode)

    expect(forceStationCode).toBe("0000")
  })
})
