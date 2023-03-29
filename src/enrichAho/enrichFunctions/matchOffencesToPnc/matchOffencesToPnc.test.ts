import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"
import summariseMatching from "tests/helpers/summariseMatching"
import matchOffencesToPnc from "./matchOffencesToPnc"

type OffenceData = {
  code: string
  start: Date
  end: Date
  sequence: number
}

const generateMockAhoWithOffences = (
  offences: OffenceData[],
  courtCaseReference: string,
  pncOffences: OffenceData[]
): AnnotatedHearingOutcome => {
  return {
    AnnotatedHearingOutcome: {
      HearingOutcome: {
        Case: {
          HearingDefendant: {
            Offence: offences.map((o) => ({
              CriminalProsecutionReference: {
                OffenceReason: {
                  __type: "NationalOffenceReason",
                  OffenceCode: {
                    FullCode: o.code
                  }
                }
              },
              ActualOffenceStartDate: {
                StartDate: o.start
              },
              ActualOffenceEndDate: {
                EndDate: o.end
              },
              CourtOffenceSequenceNumber: o.sequence
            }))
          }
        }
      }
    },
    PncQuery: {
      courtCases: [
        {
          courtCaseReference,
          offences: pncOffences.map((o) => ({
            offence: {
              cjsOffenceCode: o.code,
              startDate: o.start,
              endDate: o.end,
              sequenceNumber: o.sequence
            }
          }))
        }
      ]
    },
    Exceptions: []
  } as unknown as AnnotatedHearingOutcome
}

describe("matchOffencesToPnc", () => {
  describe("perfect matches", () => {
    it("should match offences where everything matches", () => {
      const offence = { code: "AB1234", start: new Date("2022-01-01"), end: new Date("2022-01-01"), sequence: 1 }
      const aho = generateMockAhoWithOffences([offence], "abcd/1234", [offence])
      const result = matchOffencesToPnc(aho)
      const matchingSummary = summariseMatching(result)
      expect(matchingSummary).toStrictEqual({
        courtCaseReference: "abcd/1234",
        offences: [
          {
            hoSequenceNumber: 1,
            addedByCourt: false,
            pncSequenceNumber: 1
          }
        ]
      })
    })
  })
})
