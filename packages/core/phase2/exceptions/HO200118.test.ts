import type { Offence } from "../../types/AnnotatedHearingOutcome"
import generateAhoFromOffenceList from "../tests/fixtures/helpers/generateAhoFromOffenceList"
import HO200118 from "./HO200118"

describe("HO200118", () => {
  it("should return exception when all recordable offences have non-recordable results", () => {
    const aho = generateAhoFromOffenceList([
      {
        CriminalProsecutionReference: {
          OffenceReasonSequence: undefined
        },
        OffenceCategory: "B7",
        Result: [
          {
            PNCDisposalType: 2068
          },
          {
            PNCDisposalType: 1000
          }
        ]
      },
      {
        CriminalProsecutionReference: {
          OffenceReasonSequence: "1"
        },
        Result: [
          {
            PNCDisposalType: 1000
          },
          {
            PNCDisposalType: 1000
          }
        ]
      },
      {
        CriminalProsecutionReference: {
          OffenceReasonSequence: "2"
        },
        Result: [
          {
            PNCDisposalType: 1000
          },
          {
            PNCDisposalType: 1000
          }
        ]
      }
    ] as Offence[])

    const exceptions = HO200118(aho)

    expect(exceptions).toEqual([
      {
        code: "HO200118",
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "ArrestSummonsNumber"]
      }
    ])
  })

  it("should not return exception when a recordable offence has recordable results", () => {
    const aho = generateAhoFromOffenceList([
      {
        CriminalProsecutionReference: {
          OffenceReasonSequence: "1"
        },
        Result: [
          {
            PNCDisposalType: 2068
          },
          {
            PNCDisposalType: 1000
          }
        ]
      },
      {
        CriminalProsecutionReference: {
          OffenceReasonSequence: undefined
        },
        OffenceCategory: "B7",
        Result: [
          {
            PNCDisposalType: 2068
          },
          {
            PNCDisposalType: 1000
          }
        ]
      }
    ] as Offence[])

    const exceptions = HO200118(aho)

    expect(exceptions).toHaveLength(0)
  })

  it("should not return exception when there are no recordable offences", () => {
    const aho = generateAhoFromOffenceList([
      {
        CriminalProsecutionReference: {
          OffenceReasonSequence: undefined
        },
        OffenceCategory: "B7",
        Result: [
          {
            PNCDisposalType: 2068
          },
          {
            PNCDisposalType: 1000
          }
        ]
      }
    ] as Offence[])

    const exceptions = HO200118(aho)

    expect(exceptions).toHaveLength(0)
  })

  it("should not return exception when there are no offences", () => {
    const aho = generateAhoFromOffenceList([])

    const exceptions = HO200118(aho)

    expect(exceptions).toHaveLength(0)
  })
})
