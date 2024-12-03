import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import type { Exception } from "types/exceptions"
import createException from "../../helpers/createException"
import hasOffenceMatchingExceptions, { filterOffenceMatchingExceptions } from "./hasOffenceMatchingExceptions"

describe("hasPNCException", () => {
  it("should return true if any PNC exceptions are raised", () => {
    const exceptions: Exception[] = [
      createException(ExceptionCode.HO100310, [
        "AnnotatedHearingOutcome",
        "HearingOutcome",
        "Case",
        "HearingDefendant",
        "Offence",
        "OffenceReasonSequence"
      ])
    ]
    expect(hasOffenceMatchingExceptions(exceptions)).toBeTruthy()
  })

  it("should return true if HO100332 PNC exceptions are raised", () => {
    const exceptions: Exception[] = [
      createException(ExceptionCode.HO100332, [
        "AnnotatedHearingOutcome",
        "HearingOutcome",
        "Case",
        "HearingDefendant",
        "Offence",
        "OffenceReasonSequence"
      ])
    ]
    expect(hasOffenceMatchingExceptions(exceptions)).toBeTruthy()
  })

  it("should return false if no PNC exceptions are raised", () => {
    const exceptions: Exception[] = [
      createException(ExceptionCode.HO100100, [
        "AnnotatedHearingOutcome",
        "HearingOutcome",
        "Case",
        "HearingDefendant",
        "Offence",
        "Result"
      ])
    ]
    expect(hasOffenceMatchingExceptions(exceptions)).toBeFalsy()
  })

  it("should return false if no exceptions are raised", () => {
    const exceptions: Exception[] = []
    expect(hasOffenceMatchingExceptions(exceptions)).toBeFalsy()
  })
})

describe("filterOffenceMatchingExceptions", () => {
  it("should return PNC exceptions", () => {
    const exceptions: Exception[] = [
      createException(ExceptionCode.HO100310, [
        "AnnotatedHearingOutcome",
        "HearingOutcome",
        "Case",
        "HearingDefendant",
        "Offence",
        "OffenceReasonSequence"
      ])
    ]
    expect(filterOffenceMatchingExceptions(exceptions)).toEqual(exceptions)
  })

  it("should not return non PNC exceptions", () => {
    const exceptions: Exception[] = [
      createException(ExceptionCode.HO100100, [
        "AnnotatedHearingOutcome",
        "HearingOutcome",
        "Case",
        "HearingDefendant",
        "Offence",
        "Result"
      ])
    ]
    expect(filterOffenceMatchingExceptions(exceptions)).toEqual([])
  })

  it("should return an empty array if no exceptions are raised", () => {
    const exceptions: Exception[] = []
    expect(filterOffenceMatchingExceptions(exceptions)).toEqual([])
  })
})
