import errorPaths from "@moj-bichard7/core/phase1/lib/errorPaths"
import type Exception from "@moj-bichard7/core/phase1/types/Exception"
import { ExceptionCode } from "@moj-bichard7/core/types/ExceptionCode"
import generateExceptionsNoteText from "./generateExceptionsNoteText"

const mockExceptions: Exception[] = [
  {
    code: ExceptionCode.HO100100,
    path: errorPaths.case.asn
  },
  {
    code: ExceptionCode.HO100100,
    path: errorPaths.case.asn
  },
  {
    code: ExceptionCode.HO100101,
    path: errorPaths.case.asn
  }
]

describe("generateExceptionsNoteText", () => {
  it("should generate the triggers note text for created triggers by default", () => {
    const noteText = generateExceptionsNoteText(mockExceptions)
    expect(noteText).toBe("Error codes: 2 x HO100100, 1 x HO100101.")
  })
})
