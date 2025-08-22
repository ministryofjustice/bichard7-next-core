import type { Offence } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import getNextHearingDateFromOffences from "./getNextHearingDateFromOffences"

describe("getNextHearingDateFromOffences", () => {
  it("should return undefined from the first result with PNC disposal code 2059 when no next hearing date", () => {
    const result1 = { NextHearingDate: new Date("2025-01-01"), PNCDisposalType: 2060 }
    const result2 = { NextHearingDate: undefined, PNCDisposalType: 2058 }
    const result3 = { NextHearingDate: undefined, PNCDisposalType: 2059 }
    const result4 = { NextHearingDate: new Date("2025-01-02"), PNCDisposalType: 2059 }
    const offences = [{ Result: [result1, result2] }, { Result: [result3, result4] }] as Offence[]

    const actualNextHearingDate = getNextHearingDateFromOffences(offences)

    expect(actualNextHearingDate?.toISOString()).toBeUndefined()
  })

  it("should return the next hearing date from the first result with PNC disposal code 2059 when next hearing date exists", () => {
    const result1 = { NextHearingDate: new Date("2025-01-01"), PNCDisposalType: 2060 }
    const result2 = { NextHearingDate: undefined, PNCDisposalType: 2058 }
    const result3 = { NextHearingDate: new Date("2025-01-03"), PNCDisposalType: 2059 }
    const result4 = { NextHearingDate: new Date("2025-01-02"), PNCDisposalType: 2059 }
    const offences = [{ Result: [result1, result2] }, { Result: [result3, result4] }] as Offence[]

    const actualNextHearingDate = getNextHearingDateFromOffences(offences)

    expect(actualNextHearingDate?.toISOString()).toBe("2025-01-03T00:00:00.000Z")
  })

  it("should convert string date to date object", () => {
    const result1 = { NextHearingDate: new Date("2025-01-01"), PNCDisposalType: 2060 }
    const result2 = { NextHearingDate: undefined, PNCDisposalType: 2058 }
    const result3 = { NextHearingDate: "2025-01-05", PNCDisposalType: 2059 }
    const result4 = { NextHearingDate: new Date("2025-01-02"), PNCDisposalType: 2059 }
    const offences = [{ Result: [result1, result2] }, { Result: [result3, result4] }] as Offence[]

    const actualNextHearingDate = getNextHearingDateFromOffences(offences)

    expect(actualNextHearingDate?.toISOString()).toBe("2025-01-05T00:00:00.000Z")
  })
})
