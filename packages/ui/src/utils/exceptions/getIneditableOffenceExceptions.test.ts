import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import type { Exception } from "types/exceptions"
import getIneditableOffenceExceptions from "./getIneditableOffenceExceptions"

describe("getIneditableOffenceExceptions", () => {
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

  it("should return only ineditable offence exceptions", () => {
    const result = getIneditableOffenceExceptions(exceptions)
    expect(result).toHaveLength(3)
    expect(result[0].code).toBe(ExceptionCode.HO100103)
    expect(result[1].code).toBe(ExceptionCode.HO100105)
    expect(result[2].code).toBe(ExceptionCode.HO200212)
  })

  it("should return an empty array if no exceptions are provided", () => {
    const result = getIneditableOffenceExceptions([])
    expect(result).toEqual([])
  })

  it("should return an empty array if no ineditable exceptions are present", () => {
    const result = getIneditableOffenceExceptions([
      {
        code: ExceptionCode.HO100102,
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Hearing", "ReportRequestedDate"]
      }
    ])
    expect(result).toEqual([])
  })

  it("should handle null or undefined exceptions", () => {
    const result1 = getIneditableOffenceExceptions(null as any)
    const result2 = getIneditableOffenceExceptions(undefined as any)
    expect(result1).toEqual([])
    expect(result2).toEqual([])
  })

  it("should return all ineditable exceptions if all provided exceptions are ineditable", () => {
    const allIneditableExceptions = [
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

    const result = getIneditableOffenceExceptions(allIneditableExceptions)
    expect(result).toHaveLength(3)
    expect(result).toEqual(allIneditableExceptions)
  })
})
