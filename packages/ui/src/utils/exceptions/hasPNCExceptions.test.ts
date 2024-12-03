import type { Exception } from "types/exceptions"
import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import createException from "../../helpers/createException"
import hasPNCMatchingExceptions, { filterPNCMatchingExceptions } from "./hasPNCException"

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
    expect(hasPNCMatchingExceptions(exceptions)).toBeTruthy()
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
    expect(hasPNCMatchingExceptions(exceptions)).toBeTruthy()
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
    expect(hasPNCMatchingExceptions(exceptions)).toBeFalsy()
  })

  it("should return false if no exceptions are raised", () => {
    const exceptions: Exception[] = []
    expect(hasPNCMatchingExceptions(exceptions)).toBeFalsy()
  })
})

describe("filterPNCMatchingExceptions", () => {
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
    expect(filterPNCMatchingExceptions(exceptions)).toEqual(exceptions)
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
    expect(filterPNCMatchingExceptions(exceptions)).toEqual([])
  })

  it("should return an empty array if no exceptions are raised", () => {
    const exceptions: Exception[] = []
    expect(filterPNCMatchingExceptions(exceptions)).toEqual([])
  })
})
