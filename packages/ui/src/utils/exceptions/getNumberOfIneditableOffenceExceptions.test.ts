import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import type { Exception } from "types/exceptions"
import getNumberOfIneditableOffenceExceptions from "./getNumberOfIneditableOffenceExceptions"

describe("getNumberOfIneditableOffenceExceptions", () => {
  it("should return 0 when there are no exceptions", () => {
    const exceptions: Exception[] = []
    const result = getNumberOfIneditableOffenceExceptions(exceptions)
    expect(result).toBe(0)
  })
  it("should return 0 when all exceptions are editable", () => {
    const exceptions: Exception[] = [
      {
        code: ExceptionCode.HO100102,
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          "Result",
          "SourceOrganisation",
          "OrganisationUnitCode"
        ]
      },
      {
        code: ExceptionCode.HO100323,
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          "Result",
          "SourceOrganisation",
          "OrganisationUnitCode"
        ]
      },
      {
        code: ExceptionCode.HO100200,
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          "Result",
          "SourceOrganisation",
          "OrganisationUnitCode"
        ]
      }
    ]
    const result = getNumberOfIneditableOffenceExceptions(exceptions)
    expect(result).toBe(0)
  })

  it("should return 2 ineditable exceptions when all exceptions are ineditable", () => {
    const exceptions: Exception[] = [
      {
        code: ExceptionCode.HO100103,
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          "Result",
          "NextHearingTime"
        ]
      },
      {
        code: ExceptionCode.HO100105,
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          "Result",
          "NumberOfOffencesTIC"
        ]
      }
    ]
    const result = getNumberOfIneditableOffenceExceptions(exceptions)
    expect(result).toBe(2)
  })
  it("should return 3 ineditable exceptions when there is a mix of editable and ineditable exceptions", () => {
    const exceptions: Exception[] = [
      {
        code: ExceptionCode.HO100103,
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          "Result",
          "NextHearingTime"
        ]
      },
      {
        code: ExceptionCode.HO100105,
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          "Result",
          "NumberOfOffencesTIC"
        ]
      },
      {
        code: ExceptionCode.HO100200,
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          "Result",
          "SourceOrganisation",
          "OrganisationUnitCode"
        ]
      }, //Exception not in ineditable list
      {
        code: ExceptionCode.HO200212,
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          "CriminalProsecutionReference",
          "OffenceReason",
          "OffenceCode",
          "Reason"
        ]
      }
    ]
    const result = getNumberOfIneditableOffenceExceptions(exceptions)
    expect(result).toBe(3)
  })
})
