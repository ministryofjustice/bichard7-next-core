import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

import type { PncErrorRangesForException } from "./getPncExceptionFromMessage"

import getPncExceptionFromMessage from "./getPncExceptionFromMessage"

describe("getPncExceptionFromMessage", () => {
  const defaultPncException = ExceptionCode.HO100315
  const pncErrorRanges: PncErrorRangesForException[] = [
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
    { errorAtStartOfRange: "I0013", pncExceptionCode: ExceptionCode.HO100301 },
    { errorAtStartOfRange: "PNCUE", pncExceptionCode: ExceptionCode.HO100302 },
    { errorAtStartOfRange: "I0256", pncExceptionCode: ExceptionCode.HO100313 }
  ])(
    "returns the exception for a PNC message at the start of an error range e.g. $errorAtStartOfRange",
    ({ errorAtStartOfRange, pncExceptionCode }) => {
      const pncErrorMessage = `${errorAtStartOfRange} Some PNC message`

      const exception = getPncExceptionFromMessage(pncErrorMessage, pncErrorRanges, defaultPncException)

      expect(exception).toStrictEqual({
        code: pncExceptionCode,
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "ArrestSummonsNumber"],
        message: pncErrorMessage
      })
    }
  )

  it("returns the exception for a PNC message in between an error range", () => {
    const errorInBetweenRange = "I0019"
    const pncErrorMessage = `${errorInBetweenRange} Some PNC message`

    const exception = getPncExceptionFromMessage(pncErrorMessage, pncErrorRanges, defaultPncException)

    expect(exception).toStrictEqual({
      code: ExceptionCode.HO100301,
      path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "ArrestSummonsNumber"],
      message: pncErrorMessage
    })
  })

  it("returns the exception for a PNC message at the end of an error range", () => {
    const errorAtEndOfRange = "I0022"
    const pncErrorMessage = `${errorAtEndOfRange} Some PNC message`

    const exception = getPncExceptionFromMessage(pncErrorMessage, pncErrorRanges, defaultPncException)

    expect(exception).toStrictEqual({
      code: ExceptionCode.HO100301,
      path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "ArrestSummonsNumber"],
      message: pncErrorMessage
    })
  })

  it("returns the default exception for a PNC message not within any error ranges", () => {
    const errorOutsideAllRanges = "I9999"
    const pncErrorMessage = `${errorOutsideAllRanges} Some PNC message`

    const exception = getPncExceptionFromMessage(pncErrorMessage, pncErrorRanges, defaultPncException)

    expect(exception).toStrictEqual({
      code: defaultPncException,
      path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "ArrestSummonsNumber"],
      message: pncErrorMessage
    })
  })
})
