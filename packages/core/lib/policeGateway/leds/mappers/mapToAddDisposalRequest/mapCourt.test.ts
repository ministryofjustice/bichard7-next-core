import { PNC_COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR } from "../../../../../phase3/lib/getPncCourtCode"
import mapCourt from "./mapCourt"

describe("mapCourt", () => {
  it("returns an object with courtIdentityType name when code is PNC_COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR", () => {
    const expectedCourt = {
      courtIdentityType: "name",
      courtName: "dummyCourtName"
    }

    const court = mapCourt(PNC_COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR, "dummyCourtName")

    expect(court).toStrictEqual(expectedCourt)
  })

  it("returns an object with courtIdentityType code when code is PNC_COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR", () => {
    const expectedCourt = {
      courtIdentityType: "code",
      courtCode: "dummyCourtCode"
    }

    const court = mapCourt("dummyCourtCode", null)

    expect(court).toStrictEqual(expectedCourt)
  })

  it("returns courtName as empty string when name is null and code is PNC_COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR", () => {
    const court = mapCourt(PNC_COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR, null)
    expect(court).toStrictEqual({
      courtIdentityType: "name",
      courtName: ""
    })
  })

  it("returns courtCode as empty string when code is null", () => {
    const court = mapCourt(null, "irrelevantName")
    expect(court).toStrictEqual({
      courtIdentityType: "code",
      courtCode: ""
    })
  })
})
