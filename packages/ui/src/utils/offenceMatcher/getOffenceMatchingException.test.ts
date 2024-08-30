import { Exception } from "types/exceptions"
import {
  getOffenceMatchingException,
  GetOffenceMatchingExceptionResult,
  getOffenceMatchingExceptions
} from "./getOffenceMatchingException"
import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import { ExceptionBadgeType } from "utils/exceptions/exceptionBadgeType"

describe("getOffenceMatchingExceptions", () => {
  it("returns an empty array when given no exceptions", () => {
    const result = getOffenceMatchingExceptions([])
    expect(result).toEqual([])
  })

  it("returns an empty array when given exception that is not in array of valid values", () => {
    const exception: Exception = { code: ExceptionCode.HO100304, path: ["test"] }
    const result = getOffenceMatchingExceptions([exception])
    expect(result).toEqual([])
  })

  it("returns exception when given exception that is in array of valid values", () => {
    const exception: Exception = { code: ExceptionCode.HO100310, path: ["test"] }
    const result = getOffenceMatchingExceptions([exception])
    expect(result).toEqual([exception])
  })

  it("returns exception when given multiple exceptions and exception is in array of valid values", () => {
    const exceptions: Exception[] = [
      { code: ExceptionCode.HO100304, path: ["test"] },
      { code: ExceptionCode.HO100310, path: ["test"] }
    ]
    const result = getOffenceMatchingExceptions(exceptions)
    expect(result).toEqual([exceptions[1]])
  })
})

describe("getOffenceMatchingException", () => {
  it("returns undefined when given an empty array", () => {
    const result: GetOffenceMatchingExceptionResult = getOffenceMatchingException([], 0)
    expect(result).toBeUndefined()
  })

  it("returns exception with AddedByCourt badge when given an exception in noOffencesMatched array", () => {
    const exception: Exception = { code: ExceptionCode.HO100507, path: ["test"] }
    const result: GetOffenceMatchingExceptionResult = getOffenceMatchingException([exception], 0)
    expect(result).toEqual({ code: ExceptionCode.HO100507, badge: ExceptionBadgeType.AddedByCourt })
  })

  it("returns exception with Unmatched badge when given an exception in noOffencesMatched array", () => {
    const exception: Exception = { code: ExceptionCode.HO100304, path: ["test"] }
    const result: GetOffenceMatchingExceptionResult = getOffenceMatchingException([exception], 0)
    expect(result).toEqual({ code: ExceptionCode.HO100304, badge: ExceptionBadgeType.Unmatched })
  })

  it("returns exception when given an exception in offenceNotMatched array & exceptionPath and hearingOutcomePath are equal", () => {
    const exception: Exception = {
      code: ExceptionCode.HO100310,
      path: [
        "HearingOutcome",
        "Case",
        "HearingDefendant",
        "Offence",
        1,
        "CriminalProsecutionReference",
        "OffenceReasonSequence"
      ]
    }
    const result: GetOffenceMatchingExceptionResult = getOffenceMatchingException([exception], 1)
    expect(result).toEqual({ code: ExceptionCode.HO100310, badge: ExceptionBadgeType.Unmatched })
  })

  it("returns undefined when given an exception in offenceNotMatched array but exceptionPath and hearingOutcomePath are not equal", () => {
    const exception: Exception = {
      code: ExceptionCode.HO100310,
      path: [
        "HearingOutcome",
        "Case",
        "HearingDefendant",
        "Offence",
        1,
        "CriminalProsecutionReference",
        "OffenceReasonSequence"
      ]
    }
    const result: GetOffenceMatchingExceptionResult = getOffenceMatchingException([exception], 2)
    expect(result).toBeUndefined()
  })

  it("returns first exception when given exceptions in noOffencesMatched array", () => {
    const exceptions: Exception[] = [
      { code: ExceptionCode.HO100507, path: ["test"] },
      { code: ExceptionCode.HO100304, path: ["test"] }
    ]
    const result: GetOffenceMatchingExceptionResult = getOffenceMatchingException(exceptions, 1)
    expect(result).toEqual({ code: ExceptionCode.HO100507, badge: ExceptionBadgeType.AddedByCourt })
  })

  it("returns first exception when given exceptions in offenceNotMatched array", () => {
    const exceptions: Exception[] = [
      {
        code: ExceptionCode.HO100310,
        path: [
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          1,
          "CriminalProsecutionReference",
          "OffenceReasonSequence"
        ]
      },
      {
        code: ExceptionCode.HO100312,
        path: [
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          2,
          "CriminalProsecutionReference",
          "OffenceReasonSequence"
        ]
      }
    ]
    const result: GetOffenceMatchingExceptionResult = getOffenceMatchingException(exceptions, 2)
    expect(result).toEqual({ code: ExceptionCode.HO100312, badge: ExceptionBadgeType.Unmatched })
  })

  it("returns first exception when given exceptions in noOffencesMatched array and offenceNotMatched array", () => {
    const exceptions: Exception[] = [
      { code: ExceptionCode.HO100507, path: ["test"] },
      {
        code: ExceptionCode.HO100310,
        path: [
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          1,
          "CriminalProsecutionReference",
          "OffenceReasonSequence"
        ]
      }
    ]
    const result: GetOffenceMatchingExceptionResult = getOffenceMatchingException(exceptions, 1)
    expect(result).toEqual({ code: ExceptionCode.HO100507, badge: ExceptionBadgeType.AddedByCourt })
  })
})
