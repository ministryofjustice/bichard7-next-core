import { isError } from "@moj-bichard7/common/types/Result"
import { Hearing, Result } from "../../../../types/AnnotatedHearingOutcome"
import getPncCourtCode from "../../getPncCourtCode"
import getPsaCourtCode from "./getPsaCourtCode"

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

describe("getPsaCourtCode", () => {
  describe("when undated warrant is not issued", () => {
    const results = [
      {
        CJSresultCode: 2611
      }
    ] as Result[]

    it("should return the PNC court code", () => {
      mockedGetPncCourtCode.mockReturnValue("0413")

      const psaCourtCode = getPsaCourtCode(hearing, results)

      expect(isError(psaCourtCode)).toBe(false)
      expect(psaCourtCode).toBe("0413")
    })

    it("should return error when it fails to get the PNC court code", () => {
      mockedGetPncCourtCode.mockReturnValue(Error("Dummy error"))

      const psaCourtCode = getPsaCourtCode(hearing, results)

      expect(isError(psaCourtCode)).toBe(true)
      expect((psaCourtCode as Error).message).toBe("Dummy error")
    })
  })

  it("should return failed to appear court code when undated warrant is issued", () => {
    const results = [
      {
        CJSresultCode: 4576
      }
    ] as Result[]

    const psaCourtCode = getPsaCourtCode(hearing, results)

    expect(isError(psaCourtCode)).toBe(false)
    expect(psaCourtCode).toBe("9998")
  })
})
