import type { Offence } from "../../../../types/AnnotatedHearingOutcome"

import getNextHearingDateFromOffencesList from "./getNextHearingDateFromOffencesList"

describe("getNextHearingDateFromOffencesList", () => {
  it.each([
    {
      date: new Date("2025-01-03"),
      return: "the next hearing date",
      when: "next haring date has value",
      expected: "2025-01-03T00:00:00.000Z"
    },
    { date: undefined, return: "undefined", when: "next haring date is undefined", expected: undefined }
  ])("should return $return from the first result with PNC disposal code 2059 when $when", ({ date, expected }) => {
    const result1 = {
      NextHearingDate: new Date("2025-01-01"),
      PNCDisposalType: 2060
    }
    const result2 = {
      NextHearingDate: undefined,
      PNCDisposalType: 2058
    }
    const result3 = {
      NextHearingDate: date,
      PNCDisposalType: 2059
    }
    const result4 = {
      NextHearingDate: new Date("2025-01-02"),
      PNCDisposalType: 2059
    }
    const offences = [
      {
        Result: [result1, result2]
      },
      {
        Result: [result3, result4]
      }
    ] as Offence[]

    const actualNextHearingDate = getNextHearingDateFromOffencesList(offences)

    expect(actualNextHearingDate?.toISOString()).toBe(expected)
  })

  it("should convert string date to date object", () => {
    const result1 = {
      NextHearingDate: new Date("2025-01-01"),
      PNCDisposalType: 2060
    }
    const result2 = {
      NextHearingDate: undefined,
      PNCDisposalType: 2058
    }
    const result3 = {
      NextHearingDate: "2025-01-05",
      PNCDisposalType: 2059
    }
    const result4 = {
      NextHearingDate: new Date("2025-01-02"),
      PNCDisposalType: 2059
    }
    const offences = [
      {
        Result: [result1, result2]
      },
      {
        Result: [result3, result4]
      }
    ] as Offence[]

    const actualNextHearingDate = getNextHearingDateFromOffencesList(offences)

    expect(actualNextHearingDate?.toISOString()).toBe("2025-01-05T00:00:00.000Z")
  })
})
