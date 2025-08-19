import type { Hearing, Result } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import { isError } from "@moj-bichard7/common/types/Result"

import getPncCourtCode from "../../getPncCourtCode"
import getRemandCourtCode from "./getRemandCourtCode"

jest.mock("../../getPncCourtCode")

const mockedGetPncCourtCode = getPncCourtCode as jest.Mock
const hearing = {
  CourtHouseCode: 1,
  CourtHearingLocation: {
    TopLevelCode: "C",
    SecondLevelCode: "01",
    ThirdLevelCode: "BB",
    BottomLevelCode: "00",
    OrganisationUnitCode: "C01BB00"
  }
} as Hearing

describe("getRemandLocationCourtCode", () => {
  describe("when dated warrant is not issued", () => {
    const results = [
      {
        CJSresultCode: 2611
      }
    ] as Result[]

    it("should return the PNC court code", () => {
      mockedGetPncCourtCode.mockReturnValue("0413")

      const remandLocationCourtCode = getRemandCourtCode(hearing, results)

      expect(isError(remandLocationCourtCode)).toBe(false)
      expect(remandLocationCourtCode).toBe("0413")
    })

    it("should return error when it fails to get the PNC court code", () => {
      mockedGetPncCourtCode.mockReturnValue(Error("Dummy error"))

      const remandLocationCourtCode = getRemandCourtCode(hearing, results)

      expect(isError(remandLocationCourtCode)).toBe(true)
      expect((remandLocationCourtCode as Error).message).toBe("Dummy error")
    })
  })

  it("should return failed to appear court code when dated warrant is issued", () => {
    const results = [
      {
        CJSresultCode: 4575
      }
    ] as Result[]

    const remandLocationCourtCode = getRemandCourtCode(hearing, results)

    expect(isError(remandLocationCourtCode)).toBe(false)
    expect(remandLocationCourtCode).toBe("9998")
  })
})
