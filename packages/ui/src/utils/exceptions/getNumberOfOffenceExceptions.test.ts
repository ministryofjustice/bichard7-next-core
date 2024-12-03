import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import type { Exception } from "types/exceptions"
import createException from "../../helpers/createException"
import getNumberOfIneditableOffenceExceptions from "./getNumberOfOffenceExceptions"

const createLargeNumberOfMixedExceptions = (count: number): Exception[] => {
  const exceptions: Exception[] = []
  for (let i = 0; i < count; i++) {
    const code = i % 2 === 0 ? ExceptionCode.HO100102 : ExceptionCode.HO100103
    const path =
      code === ExceptionCode.HO100102
        ? []
        : ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "Offence", "NextHearingTime"]
    exceptions.push(createException(code, path))
  }

  return exceptions
}

describe("getNumberOfIneditableOffenceExceptions", () => {
  it("should return 0 when there are no exceptions", () => {
    const exceptions: Exception[] = []
    const result = getNumberOfIneditableOffenceExceptions(exceptions)
    expect(result).toBe(0)
  })

  it("should return 0 when all exceptions are editable", () => {
    const exceptions: Exception[] = [
      createException(ExceptionCode.HO100102),
      createException(ExceptionCode.HO100323),
      createException(ExceptionCode.HO100200)
    ]
    const result = getNumberOfIneditableOffenceExceptions(exceptions)
    expect(result).toBe(0)
  })

  it("should return 2 when all exceptions are ineditable", () => {
    const exceptions: Exception[] = [
      createException(ExceptionCode.HO100103, [
        "AnnotatedHearingOutcome",
        "HearingOutcome",
        "Case",
        "HearingDefendant",
        "Offence",
        "NextHearingTime"
      ]),
      createException(ExceptionCode.HO100105, [
        "AnnotatedHearingOutcome",
        "HearingOutcome",
        "Case",
        "HearingDefendant",
        "Offence",
        "NumberOfOffencesTIC"
      ])
    ]
    const result = getNumberOfIneditableOffenceExceptions(exceptions)
    expect(result).toBe(2)
  })

  it("should return 3 when there is a 4 count mix of editable and ineditable exceptions", () => {
    const exceptions: Exception[] = [
      createException(ExceptionCode.HO100103, [
        "AnnotatedHearingOutcome",
        "HearingOutcome",
        "Case",
        "HearingDefendant",
        "Offence",
        "NextHearingTime"
      ]),
      createException(ExceptionCode.HO100105, [
        "AnnotatedHearingOutcome",
        "HearingOutcome",
        "Case",
        "HearingDefendant",
        "Offence",
        "NumberOfOffencesTIC"
      ]),
      createException(ExceptionCode.HO100200),
      createException(ExceptionCode.HO200212, [
        "AnnotatedHearingOutcome",
        "HearingOutcome",
        "Case",
        "HearingDefendant",
        "Offence",
        "CriminalProsecutionReference",
        "OffenceReason",
        "OffenceCode",
        "Reason"
      ]),
      createException(ExceptionCode.HO100323)
    ]
    const result = getNumberOfIneditableOffenceExceptions(exceptions)
    expect(result).toBe(3)
  })

  it("should return 1 even with different paths for editable exceptions", () => {
    const exceptions: Exception[] = [
      createException(ExceptionCode.HO100102, ["Some", "Other", "Path"]),
      createException(ExceptionCode.HO100103, [
        "AnnotatedHearingOutcome",
        "HearingOutcome",
        "Case",
        "HearingDefendant",
        "Offence",
        "NextHearingTime"
      ])
    ]
    const result = getNumberOfIneditableOffenceExceptions(exceptions)
    expect(result).toBe(1)
  })

  it("should handle a large number of mixed exceptions efficiently", () => {
    const exceptions = createLargeNumberOfMixedExceptions(1000)
    const result = getNumberOfIneditableOffenceExceptions(exceptions)
    expect(result).toBe(500)
  })
})
