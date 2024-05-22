import type { Offence, Result } from "../types/AnnotatedHearingOutcome"
import allPncOffencesContainResults from "./allPncOffencesContainResults"
import generateAhoFromOffenceList from "./tests/fixtures/helpers/generateAhoFromOffenceList"

describe("allPncOffencesContainResults", () => {
  it("should return true when case has no offences", () => {
    const aho = generateAhoFromOffenceList([])

    const result = allPncOffencesContainResults(aho)

    expect(result).toBe(true)
    expect(aho.Exceptions).toHaveLength(0)
  })

  it("should return true when case has no reportable offences", () => {
    const aho = generateAhoFromOffenceList([
      {
        OffenceCategory: "B7"
      }
    ] as Offence[])

    const result = allPncOffencesContainResults(aho)

    expect(result).toBe(true)
    expect(aho.Exceptions).toHaveLength(0)
  })

  it("should return true when all offences have at least one recordable result", () => {
    const aho = generateAhoFromOffenceList([
      {
        Result: [
          {
            PNCDisposalType: 9999
          },
          {
            PNCDisposalType: 1000
          }
        ]
      },
      {
        Result: [
          {
            PNCDisposalType: 9999
          },
          {
            PNCDisposalType: 9999
          }
        ]
      }
    ] as Offence[])

    const result = allPncOffencesContainResults(aho)

    expect(result).toBe(true)
    expect(aho.Exceptions).toHaveLength(0)
  })

  it("should return false when offences have no results", () => {
    const aho = generateAhoFromOffenceList([
      {
        Result: [] as Result[]
      },
      {
        Result: [] as Result[]
      }
    ] as Offence[])

    const result = allPncOffencesContainResults(aho)

    expect(result).toBe(false)
    expect(aho.Exceptions).toStrictEqual([
      {
        code: "HO200212",
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          0,
          "CriminalProsecutionReference",
          "OffenceReason",
          "LocalOffenceCode",
          "OffenceCode"
        ]
      },
      {
        code: "HO200212",
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          1,
          "CriminalProsecutionReference",
          "OffenceReason",
          "LocalOffenceCode",
          "OffenceCode"
        ]
      }
    ])
  })

  it("should return false and generate exception HO200212 for 'LocalOffenceCode > OffenceCode' when results of an offence are non-recordable", () => {
    const aho = generateAhoFromOffenceList([
      {
        Result: [
          {
            PNCDisposalType: 1000
          },
          {
            PNCDisposalType: 1000
          }
        ],
        CriminalProsecutionReference: {
          OffenceReason: {
            __type: "LocalOffenceReason",
            LocalOffenceCode: {
              OffenceCode: "ABC"
            }
          }
        }
      },
      {
        Result: [
          {
            PNCDisposalType: 9999
          },
          {
            PNCDisposalType: 9999
          }
        ]
      }
    ] as Offence[])

    const result = allPncOffencesContainResults(aho)

    expect(result).toBe(false)
    expect(aho.Exceptions).toStrictEqual([
      {
        code: "HO200212",
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          0,
          "CriminalProsecutionReference",
          "OffenceReason",
          "LocalOffenceCode",
          "OffenceCode"
        ]
      }
    ])
  })

  it("should return false and generate exception HO200212 for 'OffenceCode > Reason' when results of an offence are non-recordable", () => {
    const aho = generateAhoFromOffenceList([
      {
        Result: [
          {
            PNCDisposalType: 9999
          },
          {
            PNCDisposalType: 9999
          }
        ]
      },
      {
        Result: [
          {
            PNCDisposalType: 1000
          },
          {
            PNCDisposalType: 1000
          }
        ],
        CriminalProsecutionReference: {
          OffenceReason: {
            __type: "NationalOffenceReason",
            OffenceCode: {
              Reason: "Dummy reason"
            }
          }
        }
      }
    ] as Offence[])

    const result = allPncOffencesContainResults(aho)

    expect(result).toBe(false)
    expect(aho.Exceptions).toStrictEqual([
      {
        code: "HO200212",
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          1,
          "CriminalProsecutionReference",
          "OffenceReason",
          "OffenceCode",
          "Reason"
        ]
      }
    ])
  })

  it("should not generate exception HO200212 for an offence that is added by the court", () => {
    const nonRecordableResult = [
      {
        PNCDisposalType: 1000
      },
      {
        PNCDisposalType: 1000
      }
    ] as Result[]

    const aho = generateAhoFromOffenceList([
      {
        AddedByTheCourt: true,
        Result: nonRecordableResult
      },
      {
        Result: nonRecordableResult,
        CriminalProsecutionReference: {
          OffenceReason: {
            __type: "NationalOffenceReason",
            OffenceCode: {
              Reason: "Dummy reason"
            }
          }
        }
      }
    ] as Offence[])

    const result = allPncOffencesContainResults(aho)

    expect(result).toBe(false)
    expect(aho.Exceptions).toStrictEqual([
      {
        code: "HO200212",
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          1,
          "CriminalProsecutionReference",
          "OffenceReason",
          "OffenceCode",
          "Reason"
        ]
      }
    ])
  })

  it("should generate exception HO200212 on each offence with non recordable results", () => {
    const nonRecordableResult = [
      {
        PNCDisposalType: 1000
      },
      {
        PNCDisposalType: 1000
      }
    ] as Result[]

    const aho = generateAhoFromOffenceList([
      {
        Result: nonRecordableResult
      },
      {
        Result: nonRecordableResult
      }
    ] as Offence[])

    const result = allPncOffencesContainResults(aho)

    expect(result).toBe(false)
    expect(aho.Exceptions).toStrictEqual([
      {
        code: "HO200212",
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          0,
          "CriminalProsecutionReference",
          "OffenceReason",
          "LocalOffenceCode",
          "OffenceCode"
        ]
      },
      {
        code: "HO200212",
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          1,
          "CriminalProsecutionReference",
          "OffenceReason",
          "LocalOffenceCode",
          "OffenceCode"
        ]
      }
    ])
  })
})
