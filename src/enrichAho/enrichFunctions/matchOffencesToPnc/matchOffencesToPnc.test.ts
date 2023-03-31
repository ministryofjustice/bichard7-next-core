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
    it("should match single offences where everything matches", () => {
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

    it("should match multiple offences where everything matches", () => {
      const offence1 = { code: "AB1234", start: new Date("2022-01-01"), end: new Date("2022-01-01"), sequence: 1 }
      const offence2 = { code: "AC1234", start: new Date("2022-01-01"), end: new Date("2022-01-01"), sequence: 2 }
      const aho = generateMockAhoWithOffences([offence1, offence2], "abcd/1234", [offence1, offence2])
      const result = matchOffencesToPnc(aho)
      const matchingSummary = summariseMatching(result)
      expect(matchingSummary).toStrictEqual({
        courtCaseReference: "abcd/1234",
        offences: [
          {
            hoSequenceNumber: 1,
            addedByCourt: false,
            pncSequenceNumber: 1
          },
          {
            hoSequenceNumber: 2,
            addedByCourt: false,
            pncSequenceNumber: 2
          }
        ]
      })
    })
  })

  describe("mismatched sequence numbers", () => {
    it("should match single offences where everything else matches", () => {
      const offence = { code: "AB1234", start: new Date("2022-01-01"), end: new Date("2022-01-01"), sequence: 1 }
      const aho = generateMockAhoWithOffences([offence], "abcd/1234", [{ ...offence, sequence: 2 }])
      const result = matchOffencesToPnc(aho)
      const matchingSummary = summariseMatching(result)
      expect(matchingSummary).toStrictEqual({
        courtCaseReference: "abcd/1234",
        offences: [
          {
            hoSequenceNumber: 1,
            addedByCourt: false,
            pncSequenceNumber: 2
          }
        ]
      })
    })

    it("should prioritise matching fully matching offences", () => {
      const offence1 = { code: "AB1234", start: new Date("2022-01-01"), end: new Date("2022-01-01"), sequence: 1 }
      const offence2 = { code: "AC1234", start: new Date("2022-01-01"), end: new Date("2022-01-01"), sequence: 2 }
      const aho = generateMockAhoWithOffences([offence1, offence2], "abcd/1234", [
        offence1,
        { ...offence2, sequence: 3 }
      ])
      const result = matchOffencesToPnc(aho)
      const matchingSummary = summariseMatching(result)
      expect(matchingSummary).toStrictEqual({
        courtCaseReference: "abcd/1234",
        offences: [
          {
            hoSequenceNumber: 1,
            addedByCourt: false,
            pncSequenceNumber: 1
          },
          {
            hoSequenceNumber: 2,
            addedByCourt: false,
            pncSequenceNumber: 3
          }
        ]
      })
    })
  })

  describe("offences added in court", () => {
    it("should flag ho offences as being added in court", () => {
      const offence1 = { code: "AB1234", start: new Date("2022-01-01"), end: new Date("2022-01-01"), sequence: 1 }
      const offence2 = { code: "AC1234", start: new Date("2022-01-01"), end: new Date("2022-01-01"), sequence: 2 }
      const aho = generateMockAhoWithOffences([offence1, offence2], "abcd/1234", [offence1])
      const result = matchOffencesToPnc(aho)
      const matchingSummary = summariseMatching(result)
      expect(matchingSummary).toStrictEqual({
        courtCaseReference: "abcd/1234",
        offences: [
          {
            hoSequenceNumber: 1,
            addedByCourt: false,
            pncSequenceNumber: 1
          },
          {
            hoSequenceNumber: 2,
            addedByCourt: true,
            pncSequenceNumber: undefined
          }
        ]
      })
    })

    it("should flag multiple ho offences as being added in court", () => {
      const offence1 = { code: "AB1234", start: new Date("2022-01-01"), end: new Date("2022-01-01"), sequence: 1 }
      const offence2 = { code: "AC1234", start: new Date("2022-01-01"), end: new Date("2022-01-01"), sequence: 2 }
      const offence3 = { code: "AC1234", start: new Date("2022-01-01"), end: new Date("2022-01-01"), sequence: 3 }
      const aho = generateMockAhoWithOffences([offence1, offence2, offence3], "abcd/1234", [offence1])
      const result = matchOffencesToPnc(aho)
      const matchingSummary = summariseMatching(result)
      expect(matchingSummary).toStrictEqual({
        courtCaseReference: "abcd/1234",
        offences: [
          {
            hoSequenceNumber: 1,
            addedByCourt: false,
            pncSequenceNumber: 1
          },
          {
            hoSequenceNumber: 2,
            addedByCourt: true,
            pncSequenceNumber: undefined
          },
          {
            hoSequenceNumber: 3,
            addedByCourt: true,
            pncSequenceNumber: undefined
          }
        ]
      })
    })
  })
})
