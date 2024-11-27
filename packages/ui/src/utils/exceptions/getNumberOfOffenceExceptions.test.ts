import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import type { Exception } from "types/exceptions"
import createException from "../../helpers/createException"
import getNumberOfIneditableOffenceExceptions from "./getNumberOfOffenceExceptions"

const createLargeNumberOfMixedExceptions = (count: number): Exception[] => {
  const exceptions: Exception[] = []
  for (let i = 0; i < count; i++) {
    const code = i % 2 === 0 ? ExceptionCode.HO100102 : ExceptionCode.HO100103 // Alternating editable and ineditable
    exceptions.push(createException(code))
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
      createException(ExceptionCode.HO100103, ["NextHearingTime"]),
      createException(ExceptionCode.HO100105, ["NumberOfOffencesTIC"])
    ]
    const result = getNumberOfIneditableOffenceExceptions(exceptions)
    expect(result).toBe(2)
  })

  it("should return 3 when there is a 4 count mix of editable and ineditable exceptions", () => {
    const exceptions: Exception[] = [
      createException(ExceptionCode.HO100103, ["NextHearingTime"]), // Ineditable
      createException(ExceptionCode.HO100105, ["NumberOfOffencesTIC"]), // Ineditable
      createException(ExceptionCode.HO100200, ["SourceOrganisation", "OrganisationUnitCode"]), // Editable
      createException(ExceptionCode.HO200212, [
        // Ineditable
        "CriminalProsecutionReference",
        "OffenceReason",
        "OffenceCode",
        "Reason"
      ]),
      createException(ExceptionCode.HO100323) // Editable
    ]
    const result = getNumberOfIneditableOffenceExceptions(exceptions)
    expect(result).toBe(3)
  })

  it("should return 1 even with different paths for editable exceptions", () => {
    const exceptions: Exception[] = [
      createException(ExceptionCode.HO100102, ["Some", "Other", "Path"]), // Editable, but different path
      createException(ExceptionCode.HO100103, ["NextHearingTime"]) // Ineditable
    ]
    const result = getNumberOfIneditableOffenceExceptions(exceptions)
    expect(result).toBe(1)
  })

  it("should handle a large number of mixed exceptions efficiently", () => {
    const exceptions = createLargeNumberOfMixedExceptions(1000)
    const result = getNumberOfIneditableOffenceExceptions(exceptions)
    expect(result).toBe(500) // Half should be ineditable
  })
})
