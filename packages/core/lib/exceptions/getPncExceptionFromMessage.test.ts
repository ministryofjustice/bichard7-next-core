import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

import type { ErrorRangeDefinition } from "./getPncExceptionFromMessage"

import getPncExceptionFromMessage from "./getPncExceptionFromMessage"

describe("getPncExceptionFromMessage", () => {
  const defaultPncException = ExceptionCode.HO100315
  const pncErrorRanges: ErrorRangeDefinition[] = [
    {
      code: ExceptionCode.HO100301,
      ranges: [{ start: "I0013", end: "I0022" }]
    },
    {
      code: ExceptionCode.HO100302,
      ranges: [{ start: "PNCAM" }, { start: "PNCUE" }]
    },
    {
      code: ExceptionCode.HO100313,
      ranges: [{ start: "I0208", end: "I0209" }, { start: "I0212" }, { start: "I0256" }]
    }
  ]

  it.each([
    { startOfErrorRange: "I0013", code: ExceptionCode.HO100301 },
    { startOfErrorRange: "PNCUE", code: ExceptionCode.HO100302 },
    { startOfErrorRange: "I0256", code: ExceptionCode.HO100313 }
  ])(
    "returns the exception for a PNC message at the start of an error range e.g. $startOfErrorRange",
    ({ startOfErrorRange, code }) => {
      const message = `${startOfErrorRange} Some PNC message`

      const exception = getPncExceptionFromMessage(message, pncErrorRanges, defaultPncException)

      expect(exception).toStrictEqual({
        code,
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "ArrestSummonsNumber"],
        message
      })
    }
  )

  it("returns the exception for a PNC message in between an error range", () => {
    const inBetweenErrorRange = "I0019"
    const message = `${inBetweenErrorRange} Some PNC message`

    const exception = getPncExceptionFromMessage(message, pncErrorRanges, defaultPncException)

    expect(exception).toStrictEqual({
      code: ExceptionCode.HO100301,
      path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "ArrestSummonsNumber"],
      message
    })
  })

  it("returns the exception for a PNC message at the end of an error range", () => {
    const inBetweenErrorRange = "I0022"
    const message = `${inBetweenErrorRange} Some PNC message`

    const exception = getPncExceptionFromMessage(message, pncErrorRanges, defaultPncException)

    expect(exception).toStrictEqual({
      code: ExceptionCode.HO100301,
      path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "ArrestSummonsNumber"],
      message
    })
  })

  it("returns the default exception for a PNC message not within any error ranges", () => {
    const outsideAnyErrorRanges = "I9999"
    const message = `${outsideAnyErrorRanges} Some PNC message`

    const exception = getPncExceptionFromMessage(message, pncErrorRanges, defaultPncException)

    expect(exception).toStrictEqual({
      code: defaultPncException,
      path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "ArrestSummonsNumber"],
      message
    })
  })
})
