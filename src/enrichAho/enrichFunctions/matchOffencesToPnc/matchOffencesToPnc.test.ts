import errorPaths from "src/lib/errorPaths"
import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"
import summariseMatching from "tests/helpers/summariseMatching"
import matchOffencesToPnc from "./matchOffencesToPnc"

type OffenceData = {
  code: string
  start: Date
  end?: Date
  sequence: number
  resultCodes?: number[]
  disposals?: number[]
  manualSequence?: number
}

type PncCourtCaseData = {
  courtCaseReference: string
  offences: OffenceData[]
}

const finalDisposal = 2063
const nonFinalDisposal = 2507

const generateMockAhoWithOffences = (
  offences: OffenceData[],
  pncCases: PncCourtCaseData[]
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
                },
                ...(o.manualSequence !== undefined ? { OffenceReasonSequence: o.manualSequence } : {})
              },
              ActualOffenceStartDate: {
                StartDate: o.start
              },
              ...(o.end
                ? {
                    ActualOffenceEndDate: {
                      EndDate: o.end
                    }
                  }
                : {}),
              CourtOffenceSequenceNumber: o.sequence,
              Result: (o.resultCodes ?? [1234]).map((CJSresultCode) => ({ CJSresultCode })),
              ...(o.manualSequence !== undefined ? { ManualSequenceNumber: true } : {})
            }))
          }
        }
      }
    },
    PncQuery: {
      courtCases: pncCases.map((pncCase) => ({
        courtCaseReference: pncCase.courtCaseReference,
        offences: pncCase.offences.map((o) => ({
          offence: {
            cjsOffenceCode: o.code,
            startDate: o.start,
            endDate: o.end,
            sequenceNumber: o.sequence
          },
          ...(o.disposals && o.disposals?.length > 0 ? { disposals: o.disposals.map((adj) => ({ type: adj })) } : {})
        }))
      }))
    },
    Exceptions: []
  } as unknown as AnnotatedHearingOutcome
}

describe("matchOffencesToPnc", () => {
  describe("perfect matches", () => {
    it("should match single offences where everything matches", () => {
      const offence = { code: "AB1234", start: new Date("2022-01-01"), end: new Date("2022-01-01"), sequence: 1 }
      const aho = generateMockAhoWithOffences([offence], [{ courtCaseReference: "abcd/1234", offences: [offence] }])
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
      const aho = generateMockAhoWithOffences(
        [offence1, offence2],
        [{ courtCaseReference: "abcd/1234", offences: [offence1, offence2] }]
      )
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

    it("should match multiple offences across different court cases", () => {
      const offence1 = { code: "AB1234", start: new Date("2022-01-01"), end: new Date("2022-01-01"), sequence: 1 }
      const offence2 = {
        code: "AC1234",
        start: new Date("2022-01-01"),
        end: new Date("2022-01-01"),
        sequence: 1,
        disposals: [finalDisposal]
      }
      const offence3 = { code: "AD1234", start: new Date("2022-01-01"), end: new Date("2022-01-01"), sequence: 2 }
      const aho = generateMockAhoWithOffences(
        [offence1, offence3],
        [
          { courtCaseReference: "abcd/1234", offences: [offence1] },
          { courtCaseReference: "efgh/5678", offences: [offence2, offence3] }
        ]
      )
      const result = matchOffencesToPnc(aho)
      const matchingSummary = summariseMatching(result)
      expect(matchingSummary).toStrictEqual({
        offences: [
          {
            courtCaseReference: "abcd/1234",
            hoSequenceNumber: 1,
            addedByCourt: false,
            pncSequenceNumber: 1
          },
          { courtCaseReference: "efgh/5678", hoSequenceNumber: 2, addedByCourt: false, pncSequenceNumber: 2 }
        ]
      })
    })
  })

  describe("mismatched sequence numbers", () => {
    it("should match single offences where everything else matches", () => {
      const offence = { code: "AB1234", start: new Date("2022-01-01"), end: new Date("2022-01-01"), sequence: 1 }
      const aho = generateMockAhoWithOffences(
        [offence],
        [{ courtCaseReference: "abcd/1234", offences: [{ ...offence, sequence: 2 }] }]
      )
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

    it("should match multiple offences where everything else matches", () => {
      const offence1 = { code: "AB1234", start: new Date("2022-01-01"), end: new Date("2022-01-01"), sequence: 1 }
      const offence2 = { code: "AC1234", start: new Date("2022-01-01"), end: new Date("2022-01-01"), sequence: 2 }
      const aho = generateMockAhoWithOffences(
        [offence1, offence2],
        [
          {
            courtCaseReference: "abcd/1234",
            offences: [
              { ...offence1, sequence: 3 },
              { ...offence2, sequence: 4 }
            ]
          }
        ]
      )
      const result = matchOffencesToPnc(aho)
      const matchingSummary = summariseMatching(result)
      expect(matchingSummary).toStrictEqual({
        courtCaseReference: "abcd/1234",
        offences: [
          {
            hoSequenceNumber: 1,
            addedByCourt: false,
            pncSequenceNumber: 3
          },
          {
            hoSequenceNumber: 2,
            addedByCourt: false,
            pncSequenceNumber: 4
          }
        ]
      })
    })

    it("should match multiple offences where everything else matches across court cases", () => {
      const offence1 = { code: "AB1234", start: new Date("2022-01-01"), end: new Date("2022-01-01"), sequence: 3 }
      const offence2 = { code: "AC1234", start: new Date("2022-01-01"), end: new Date("2022-01-01"), sequence: 4 }
      const aho = generateMockAhoWithOffences(
        [offence1, offence2],
        [
          {
            courtCaseReference: "abcd/1234",
            offences: [{ ...offence1, sequence: 1 }]
          },
          {
            courtCaseReference: "efgh/1234",
            offences: [{ ...offence2, sequence: 1 }]
          }
        ]
      )
      const result = matchOffencesToPnc(aho)
      const matchingSummary = summariseMatching(result)
      expect(matchingSummary).toStrictEqual({
        offences: [
          {
            courtCaseReference: "abcd/1234",
            hoSequenceNumber: 3,
            addedByCourt: false,
            pncSequenceNumber: 1
          },
          {
            courtCaseReference: "efgh/1234",
            hoSequenceNumber: 4,
            addedByCourt: false,
            pncSequenceNumber: 1
          }
        ]
      })
    })
  })

  describe("fuzzy matching dates", () => {
    it("should match single offences where everything else matches", () => {
      const hoOffence = { code: "AB1234", start: new Date("2022-01-02"), end: new Date("2022-01-09"), sequence: 1 }
      const pncOffence = { code: "AB1234", start: new Date("2022-01-01"), end: new Date("2022-01-10"), sequence: 1 }
      const aho = generateMockAhoWithOffences(
        [hoOffence],
        [{ courtCaseReference: "abcd/1234", offences: [pncOffence] }]
      )
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

    it("should match multiple offences where everything else matches", () => {
      const hoOffence1 = { code: "AB1234", start: new Date("2022-01-02"), end: new Date("2022-01-09"), sequence: 1 }
      const hoOffence2 = { code: "AC1234", start: new Date("2022-01-02"), end: new Date("2022-01-09"), sequence: 2 }
      const pncOffence1 = { code: "AB1234", start: new Date("2022-01-01"), end: new Date("2022-01-10"), sequence: 1 }
      const pncOffence2 = { code: "AC1234", start: new Date("2022-01-01"), end: new Date("2022-01-10"), sequence: 2 }
      const aho = generateMockAhoWithOffences(
        [hoOffence1, hoOffence2],
        [
          {
            courtCaseReference: "abcd/1234",
            offences: [pncOffence1, pncOffence2]
          }
        ]
      )
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

    it("should match multiple offences where everything else matches across court cases", () => {
      const hoOffence1 = { code: "AB1234", start: new Date("2022-01-02"), end: new Date("2022-01-09"), sequence: 1 }
      const hoOffence2 = { code: "AC1234", start: new Date("2022-01-02"), end: new Date("2022-01-09"), sequence: 2 }
      const pncOffence1 = { code: "AB1234", start: new Date("2022-01-01"), end: new Date("2022-01-10"), sequence: 1 }
      const pncOffence2 = { code: "AC1234", start: new Date("2022-01-01"), end: new Date("2022-01-10"), sequence: 2 }
      const aho = generateMockAhoWithOffences(
        [hoOffence1, hoOffence2],
        [
          {
            courtCaseReference: "abcd/1234",
            offences: [pncOffence1]
          },
          {
            courtCaseReference: "efgh/1234",
            offences: [pncOffence2]
          }
        ]
      )
      const result = matchOffencesToPnc(aho)
      const matchingSummary = summariseMatching(result)
      expect(matchingSummary).toStrictEqual({
        offences: [
          {
            courtCaseReference: "abcd/1234",
            hoSequenceNumber: 1,
            addedByCourt: false,
            pncSequenceNumber: 1
          },
          {
            courtCaseReference: "efgh/1234",
            hoSequenceNumber: 2,
            addedByCourt: false,
            pncSequenceNumber: 2
          }
        ]
      })
    })

    it("should match exact date matches with priority over fuzzy date matches", () => {
      const hoOffence1 = { code: "AB1234", start: new Date("2022-01-03"), end: new Date("2022-01-07"), sequence: 1 }
      const hoOffence2 = { code: "AB1234", start: new Date("2022-01-02"), end: new Date("2022-01-09"), sequence: 2 }
      const pncOffence1 = { code: "AB1234", start: new Date("2022-01-01"), end: new Date("2022-01-10"), sequence: 1 }
      const pncOffence2 = { code: "AB1234", start: new Date("2022-01-03"), end: new Date("2022-01-07"), sequence: 2 }
      const aho = generateMockAhoWithOffences(
        [hoOffence1, hoOffence2],
        [
          {
            courtCaseReference: "abcd/1234",
            offences: [pncOffence1, pncOffence2]
          }
        ]
      )
      const result = matchOffencesToPnc(aho)
      const matchingSummary = summariseMatching(result)
      expect(matchingSummary).toStrictEqual({
        courtCaseReference: "abcd/1234",
        offences: [
          {
            hoSequenceNumber: 1,
            addedByCourt: false,
            pncSequenceNumber: 2
          },
          {
            hoSequenceNumber: 2,
            addedByCourt: false,
            pncSequenceNumber: 1
          }
        ]
      })
    })

    it("should match offences where the ho end date is missing but start date same as the pnc start and end date", () => {
      const hoOffence = { code: "AB1234", start: new Date("2022-01-01"), sequence: 2 }
      const pncOffence = { code: "AB1234", start: new Date("2022-01-01"), end: new Date("2022-01-01"), sequence: 1 }
      const aho = generateMockAhoWithOffences(
        [hoOffence],
        [
          {
            courtCaseReference: "abcd/1234",
            offences: [pncOffence]
          }
        ]
      )
      const result = matchOffencesToPnc(aho)
      const matchingSummary = summariseMatching(result)
      expect(matchingSummary).toStrictEqual({
        courtCaseReference: "abcd/1234",
        offences: [
          {
            hoSequenceNumber: 2,
            addedByCourt: false,
            pncSequenceNumber: 1
          }
        ]
      })
    })

    it("should match offences where the pnc end date is missing but start date same as the ho start and end date", () => {
      const hoOffence = { code: "AB1234", start: new Date("2022-01-01"), end: new Date("2022-01-01"), sequence: 2 }
      const pncOffence = { code: "AB1234", start: new Date("2022-01-01"), sequence: 1 }
      const aho = generateMockAhoWithOffences(
        [hoOffence],
        [
          {
            courtCaseReference: "abcd/1234",
            offences: [pncOffence]
          }
        ]
      )
      const result = matchOffencesToPnc(aho)
      const matchingSummary = summariseMatching(result)
      expect(matchingSummary).toStrictEqual({
        courtCaseReference: "abcd/1234",
        offences: [
          {
            hoSequenceNumber: 2,
            addedByCourt: false,
            pncSequenceNumber: 1
          }
        ]
      })
    })
  })

  describe("offences added in court", () => {
    describe("in a single court case with exact matches", () => {
      it("should flag extra ho offences as being added in court if all pnc offences are matched", () => {
        const offence1 = { code: "AB1234", start: new Date("2022-01-01"), end: new Date("2022-01-01"), sequence: 1 }
        const offence2 = { code: "AC1234", start: new Date("2022-01-01"), end: new Date("2022-01-01"), sequence: 2 }
        const aho = generateMockAhoWithOffences(
          [offence1, offence2],
          [{ courtCaseReference: "abcd/1234", offences: [offence1] }]
        )
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
        const aho = generateMockAhoWithOffences(
          [offence1, offence2, offence3],
          [{ courtCaseReference: "abcd/1234", offences: [offence1] }]
        )
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

    describe("in multiple court cases with inexact matches", () => {
      it("should flag extra ho offences as being added in court if all pnc offences are matched", () => {
        const offence1 = { code: "AB1234", start: new Date("2022-01-01"), end: new Date("2022-01-01"), sequence: 1 }
        const offence2 = { code: "AC1234", start: new Date("2022-01-01"), end: new Date("2022-01-01"), sequence: 2 }
        const offence3 = { code: "AD1234", start: new Date("2022-01-01"), end: new Date("2022-01-01"), sequence: 3 }
        const aho = generateMockAhoWithOffences(
          [offence1, offence2, offence3],
          [
            { courtCaseReference: "abcd/1234", offences: [offence1] },
            { courtCaseReference: "efgh/1234", offences: [{ ...offence2, sequence: 1 }] }
          ]
        )
        const result = matchOffencesToPnc(aho)
        const matchingSummary = summariseMatching(result)
        expect(matchingSummary).toStrictEqual({
          offences: [
            {
              courtCaseReference: "abcd/1234",
              hoSequenceNumber: 1,
              addedByCourt: false,
              pncSequenceNumber: 1
            },
            {
              courtCaseReference: "efgh/1234",
              hoSequenceNumber: 2,
              addedByCourt: false,
              pncSequenceNumber: 1
            },
            {
              hoSequenceNumber: 3,
              addedByCourt: true,
              pncSequenceNumber: undefined
            }
          ]
        })
      })

      it("should flag multiple ho offences as being added in court", () => {
        const offence1 = { code: "AB1234", start: new Date("2022-01-01"), end: new Date("2022-01-01"), sequence: 1 }
        const offence2 = { code: "AC1234", start: new Date("2022-01-01"), end: new Date("2022-01-01"), sequence: 2 }
        const offence3 = { code: "AD1234", start: new Date("2022-01-01"), end: new Date("2022-01-01"), sequence: 3 }
        const offence4 = { code: "AD1234", start: new Date("2022-01-01"), end: new Date("2022-01-01"), sequence: 4 }

        const aho = generateMockAhoWithOffences(
          [offence1, offence2, offence3, offence4],
          [
            { courtCaseReference: "abcd/1234", offences: [offence1] },
            { courtCaseReference: "efgh/1234", offences: [{ ...offence2, sequence: 1 }] }
          ]
        )
        const result = matchOffencesToPnc(aho)
        const matchingSummary = summariseMatching(result)
        expect(matchingSummary).toStrictEqual({
          offences: [
            {
              courtCaseReference: "abcd/1234",
              hoSequenceNumber: 1,
              addedByCourt: false,
              pncSequenceNumber: 1
            },
            {
              courtCaseReference: "efgh/1234",
              hoSequenceNumber: 2,
              addedByCourt: false,
              pncSequenceNumber: 1
            },
            {
              hoSequenceNumber: 3,
              addedByCourt: true,
              pncSequenceNumber: undefined
            },
            {
              hoSequenceNumber: 4,
              addedByCourt: true,
              pncSequenceNumber: undefined
            }
          ]
        })
      })
    })

    describe("in a single court case with approximate matches", () => {
      it("should add offences in court for near-identical HO offences if there is a lower number of matching PNC offences", () => {
        const offence1 = {
          code: "AB1234",
          start: new Date("2022-01-01"),
          end: new Date("2022-01-01"),
          sequence: 1
        }
        const offence2 = {
          code: "AB1234",
          start: new Date("2022-01-01"),
          end: new Date("2022-01-01"),
          sequence: 2
        }
        const aho = generateMockAhoWithOffences(
          [offence1, offence2, { ...offence2, sequence: 5 }],
          [
            {
              courtCaseReference: "abcd/1234",
              offences: [
                { ...offence1, sequence: 3 },
                { ...offence2, sequence: 4 }
              ]
            }
          ]
        )
        const result = matchOffencesToPnc(aho)
        const matchingSummary = summariseMatching(result)
        expect(matchingSummary).toStrictEqual({
          courtCaseReference: "abcd/1234",
          offences: [
            {
              hoSequenceNumber: 1,
              addedByCourt: false,
              pncSequenceNumber: 3
            },
            {
              hoSequenceNumber: 2,
              addedByCourt: false,
              pncSequenceNumber: 4
            },
            {
              hoSequenceNumber: 5,
              addedByCourt: true,
              pncSequenceNumber: undefined
            }
          ]
        })
      })
    })
  })

  describe("multiple court cases with a single offence matching", () => {
    it("should match the offence to the correct court case", () => {
      const offence1 = { code: "AB1234", start: new Date("2022-01-01"), end: new Date("2022-01-01"), sequence: 1 }
      const offence2 = { code: "AC1234", start: new Date("2022-01-01"), end: new Date("2022-01-01"), sequence: 2 }
      const aho = generateMockAhoWithOffences(
        [offence2],
        [
          { courtCaseReference: "abcd/1234", offences: [offence1] },
          { courtCaseReference: "efgh/1234", offences: [offence2] }
        ]
      )
      const result = matchOffencesToPnc(aho)
      const matchingSummary = summariseMatching(result)
      expect(matchingSummary).toStrictEqual({
        courtCaseReference: "efgh/1234",
        offences: [
          {
            hoSequenceNumber: 2,
            addedByCourt: false,
            pncSequenceNumber: 2
          }
        ]
      })
    })
  })

  describe("matching identical offences", () => {
    it("should match near-identical HO offences successfully if there are an equal number of matching PNC offences", () => {
      const offence1 = {
        code: "AB1234",
        start: new Date("2022-01-01"),
        end: new Date("2022-01-01"),
        sequence: 1
      }
      const offence2 = {
        code: "AB1234",
        start: new Date("2022-01-01"),
        end: new Date("2022-01-01"),
        sequence: 2
      }
      const aho = generateMockAhoWithOffences(
        [offence1, offence2],
        [
          {
            courtCaseReference: "abcd/1234",
            offences: [
              { ...offence1, sequence: 3 },
              { ...offence2, sequence: 4 }
            ]
          }
        ]
      )
      const result = matchOffencesToPnc(aho)
      const matchingSummary = summariseMatching(result)
      expect(matchingSummary).toStrictEqual({
        courtCaseReference: "abcd/1234",
        offences: [
          {
            hoSequenceNumber: 1,
            addedByCourt: false,
            pncSequenceNumber: 3
          },
          {
            hoSequenceNumber: 2,
            addedByCourt: false,
            pncSequenceNumber: 4
          }
        ]
      })
    })
  })

  describe("manual matches", () => {
    it("should match with a single manual match", () => {
      const offence1: OffenceData = {
        code: "AB1234",
        start: new Date("2022-01-01"),
        end: new Date("2022-01-01"),
        resultCodes: [1000],
        sequence: 3
      }
      const offence2: OffenceData = {
        code: "AB1234",
        start: new Date("2022-01-01"),
        end: new Date("2022-01-01"),
        resultCodes: [2000],
        sequence: 4,
        manualSequence: 1
      }
      const aho = generateMockAhoWithOffences(
        [offence1, offence2],
        [
          {
            courtCaseReference: "abcd/1234",
            offences: [
              { ...offence1, sequence: 1 },
              { ...offence2, sequence: 2 }
            ]
          }
        ]
      )
      const result = matchOffencesToPnc(aho)
      const matchingSummary = summariseMatching(result)
      expect(matchingSummary).toStrictEqual({
        courtCaseReference: "abcd/1234",
        offences: [
          {
            hoSequenceNumber: 3,
            addedByCourt: false,
            pncSequenceNumber: 2
          },
          {
            hoSequenceNumber: 4,
            addedByCourt: false,
            pncSequenceNumber: 1
          }
        ]
      })
    })

    it("should match with multiple manual matches", () => {
      const offence1: OffenceData = {
        code: "AB1234",
        start: new Date("2022-01-01"),
        end: new Date("2022-01-01"),
        resultCodes: [1000],
        sequence: 3,
        manualSequence: 2
      }
      const offence2: OffenceData = {
        code: "AB1234",
        start: new Date("2022-01-01"),
        end: new Date("2022-01-01"),
        resultCodes: [2000],
        sequence: 4,
        manualSequence: 1
      }
      const aho = generateMockAhoWithOffences(
        [offence1, offence2],
        [
          {
            courtCaseReference: "abcd/1234",
            offences: [
              { ...offence1, sequence: 1 },
              { ...offence2, sequence: 2 }
            ]
          }
        ]
      )
      const result = matchOffencesToPnc(aho)
      const matchingSummary = summariseMatching(result)
      expect(matchingSummary).toStrictEqual({
        courtCaseReference: "abcd/1234",
        offences: [
          {
            hoSequenceNumber: 3,
            addedByCourt: false,
            pncSequenceNumber: 2
          },
          {
            hoSequenceNumber: 4,
            addedByCourt: false,
            pncSequenceNumber: 1
          }
        ]
      })
    })
  })

  describe("HO100304", () => {
    it("should raise an exception if there aren't any matches at all", () => {
      const offence1 = { code: "AB1234", start: new Date("2022-01-01"), end: new Date("2022-01-01"), sequence: 1 }
      const offence2 = { code: "CD5678", start: new Date("2023-01-01"), end: new Date("2023-01-01"), sequence: 2 }
      const aho = generateMockAhoWithOffences([offence1], [{ courtCaseReference: "abcd/1234", offences: [offence2] }])
      const result = matchOffencesToPnc(aho)
      const matchingSummary = summariseMatching(result)
      expect(matchingSummary).toStrictEqual({
        exceptions: [
          {
            code: "HO100304",
            path: errorPaths.case.asn
          }
        ]
      })
    })

    it("should raise an exception if a PNC offence only partially matches a HO offence", () => {
      const offence1 = { code: "AB1234", start: new Date("2022-01-01"), end: new Date("2022-01-01"), sequence: 1 }
      const offence2 = { code: "AB1234", start: new Date("2023-01-01"), end: new Date("2023-01-01"), sequence: 2 }
      const aho = generateMockAhoWithOffences([offence1], [{ courtCaseReference: "abcd/1234", offences: [offence2] }])
      const result = matchOffencesToPnc(aho)
      const matchingSummary = summariseMatching(result)
      expect(matchingSummary).toStrictEqual({
        exceptions: [
          {
            code: "HO100304",
            path: errorPaths.case.asn
          }
        ]
      })
    })

    it("should raise an exception if a court offence matches more than one PNC offence", () => {
      const offence1 = { code: "AB1234", start: new Date("2022-01-01"), end: new Date("2022-01-01"), sequence: 1 }
      const offence2 = { code: "AC1234", start: new Date("2022-01-01"), end: new Date("2022-01-01"), sequence: 2 }
      const aho = generateMockAhoWithOffences(
        [offence1, offence2],
        [{ courtCaseReference: "abcd/1234", offences: [offence1, offence2, { ...offence2, sequence: 3 }] }]
      )
      const result = matchOffencesToPnc(aho)
      const matchingSummary = summariseMatching(result)
      expect(matchingSummary).toStrictEqual({
        exceptions: [
          {
            code: "HO100304",
            path: errorPaths.case.asn
          }
        ]
      })
    })

    it("should raise an exception for near-identical HO offences if there is a greater number of matching PNC offences", () => {
      const offence1 = {
        code: "AB1234",
        start: new Date("2022-01-01"),
        end: new Date("2022-01-01"),
        sequence: 1
      }
      const offence2 = {
        code: "AB1234",
        start: new Date("2022-01-01"),
        end: new Date("2022-01-01"),
        sequence: 2
      }
      const aho = generateMockAhoWithOffences(
        [offence1, offence2],
        [
          {
            courtCaseReference: "abcd/1234",
            offences: [
              { ...offence1, sequence: 3 },
              { ...offence2, sequence: 4 },
              { ...offence2, sequence: 5 }
            ]
          }
        ]
      )
      const result = matchOffencesToPnc(aho)
      const matchingSummary = summariseMatching(result)
      expect(matchingSummary).toStrictEqual({
        exceptions: [
          {
            code: "HO100304",
            path: errorPaths.case.asn
          }
        ]
      })
    })

    it("should raise an exception for unmatched pnc offences with a non-final disposal", () => {
      const offence1 = {
        code: "AB1234",
        start: new Date("2022-01-01"),
        end: new Date("2022-01-01"),
        sequence: 1
      }
      const offence2 = {
        code: "AD1234",
        start: new Date("2022-01-01"),
        end: new Date("2022-01-01"),
        disposals: [nonFinalDisposal],
        sequence: 2
      }
      const aho = generateMockAhoWithOffences(
        [offence1],
        [
          {
            courtCaseReference: "abcd/1234",
            offences: [offence1, offence2]
          }
        ]
      )
      const result = matchOffencesToPnc(aho)
      const matchingSummary = summariseMatching(result)
      expect(matchingSummary).toStrictEqual({
        exceptions: [
          {
            code: "HO100304",
            path: errorPaths.case.asn
          }
        ]
      })
    })

    it("should not raise an exception for unmatched pnc offences with a final disposal", () => {
      const offence1 = {
        code: "AB1234",
        start: new Date("2022-01-01"),
        end: new Date("2022-01-01"),
        sequence: 1
      }
      const offence2 = {
        code: "AD1234",
        start: new Date("2022-01-01"),
        end: new Date("2022-01-01"),
        disposals: [finalDisposal],
        sequence: 2
      }
      const aho = generateMockAhoWithOffences(
        [offence1],
        [
          {
            courtCaseReference: "abcd/1234",
            offences: [offence1, offence2]
          }
        ]
      )
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

  describe("HO100310", () => {
    it("should raise an exception when there are near-identical offences with non-identical results and there are no exact matches in one court case", () => {
      const offence1 = {
        code: "AB1234",
        start: new Date("2022-01-01"),
        end: new Date("2022-01-01"),
        sequence: 1,
        resultCodes: [1234]
      }
      const offence2 = {
        code: "AB1234",
        start: new Date("2022-01-01"),
        end: new Date("2022-01-01"),
        sequence: 2,
        resultCodes: [5678]
      }
      const aho = generateMockAhoWithOffences(
        [offence1, offence2],
        [
          {
            courtCaseReference: "abcd/1234",
            offences: [
              { ...offence1, sequence: 3 },
              { ...offence2, sequence: 4 }
            ]
          }
        ]
      )
      const result = matchOffencesToPnc(aho)
      const matchingSummary = summariseMatching(result)
      expect(matchingSummary).toStrictEqual({
        exceptions: [
          {
            code: "HO100310",
            path: errorPaths.offence(0).reasonSequence
          },
          {
            code: "HO100310",
            path: errorPaths.offence(1).reasonSequence
          }
        ]
      })
    })

    it("should raise an exception when there are near-identical offences with non-identical results and there are no exact matches in multiple court cases", () => {
      const offence1 = {
        code: "AB1234",
        start: new Date("2022-01-01"),
        end: new Date("2022-01-01"),
        sequence: 1,
        resultCodes: [1234]
      }
      const offence2 = {
        code: "AB1234",
        start: new Date("2022-01-01"),
        end: new Date("2022-01-01"),
        sequence: 2,
        resultCodes: [5678]
      }
      const aho = generateMockAhoWithOffences(
        [offence1, offence2],
        [
          {
            courtCaseReference: "abcd/1234",
            offences: [{ ...offence1, sequence: 1 }]
          },
          {
            courtCaseReference: "efgh/1234",
            offences: [{ ...offence2, sequence: 1 }]
          }
        ]
      )
      const result = matchOffencesToPnc(aho)
      const matchingSummary = summariseMatching(result)
      expect(matchingSummary).toStrictEqual({
        exceptions: [
          {
            code: "HO100310",
            path: errorPaths.offence(0).reasonSequence
          },
          {
            code: "HO100310",
            path: errorPaths.offence(1).reasonSequence
          }
        ]
      })
    })
  })
})
