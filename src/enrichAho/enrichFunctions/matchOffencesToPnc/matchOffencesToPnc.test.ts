import type { CourtResultMatchingSummary } from "src/comparison/types/MatchingComparisonOutput"
import errorPaths from "src/lib/errorPaths"
import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"
import summariseMatching from "tests/helpers/summariseMatching"
import matchOffencesToPnc from "./matchOffencesToPnc"

type Adjudication = {
  verdict: string
  sentenceDate?: Date
}

type OffenceData = {
  code?: string
  start?: Date
  end?: Date | null
  sequence?: number
  resultCodes?: number[]
  disposals?: number[]
  adjudications?: Adjudication[]
  manualSequence?: number
  manualCourtCase?: string
  category?: string
}

type PncCourtCaseData = {
  courtCaseReference?: string
  offences: OffenceData[]
}

const finalDisposal = 2063
const nonFinalDisposal = 2507

const generateMockAhoWithOffences = (
  offences: OffenceData[],
  pncCases: PncCourtCaseData[]
): AnnotatedHearingOutcome => {
  const defaultCaseReferences = ["abcd/1234", "efgh/5678"]

  return {
    AnnotatedHearingOutcome: {
      HearingOutcome: {
        Case: {
          HearingDefendant: {
            Offence: offences.map((o, index) => ({
              CriminalProsecutionReference: {
                OffenceReason: {
                  __type: "NationalOffenceReason",
                  OffenceCode: {
                    FullCode: o.code ?? "AB1234"
                  }
                },
                ...(o.manualSequence !== undefined ? { OffenceReasonSequence: o.manualSequence } : {})
              },
              ActualOffenceStartDate: {
                StartDate: o.start ?? new Date("2022-01-01")
              },
              ...(o.end !== null
                ? {
                    ActualOffenceEndDate: {
                      EndDate: o.end ?? new Date("2022-01-01")
                    }
                  }
                : {}),
              CourtOffenceSequenceNumber: o.sequence ?? index + 1,
              Result: (o.resultCodes ?? [1234]).map((CJSresultCode) => ({ CJSresultCode })),
              ...(o.manualCourtCase !== undefined
                ? { ManualCourtCaseReference: true, CourtCaseReferenceNumber: o.manualCourtCase }
                : {}),
              ...(o.manualSequence !== undefined ? { ManualSequenceNumber: true } : {}),
              OffenceCategory: o.category ?? "XX"
            }))
          }
        },
        Hearing: { DateOfHearing: new Date() }
      }
    },
    PncQuery: {
      courtCases: pncCases.map((pncCase, caseIndex) => ({
        courtCaseReference: pncCase.courtCaseReference ?? defaultCaseReferences[caseIndex],
        offences: pncCase.offences.map((o, index) => ({
          offence: {
            cjsOffenceCode: o.code ?? "AB1234",
            startDate: o.start ?? new Date("2022-01-01"),
            endDate: o.end,
            sequenceNumber: o.sequence ?? index + 1
          },
          ...(o.disposals && o.disposals?.length > 0 ? { disposals: o.disposals.map((code) => ({ type: code })) } : {}),
          ...(o.adjudications && o.adjudications?.length > 0 ? { adjudication: o.adjudications } : {})
        }))
      }))
    },
    Exceptions: []
  } as unknown as AnnotatedHearingOutcome
}

const matchOffences = (offences: OffenceData[], pncCases: PncCourtCaseData[]): CourtResultMatchingSummary | null => {
  const aho = generateMockAhoWithOffences(offences, pncCases)
  const result = matchOffencesToPnc(aho)
  return summariseMatching(result)
}

describe("matchOffencesToPnc", () => {
  describe("perfect matches", () => {
    it("should match single offences where everything matches", () => {
      const offence = {}
      const matchingSummary = matchOffences([offence], [{ offences: [offence] }])
      expect(matchingSummary).toStrictEqual({
        caseReference: "abcd/1234",
        offences: [{ hoSequenceNumber: 1, addedByCourt: false, pncSequenceNumber: 1 }]
      })
    })

    it("should match multiple offences where everything matches", () => {
      const offence1 = {}
      const offence2 = { code: "AC1234" }
      const matchingSummary = matchOffences([offence1, offence2], [{ offences: [offence1, offence2] }])
      expect(matchingSummary).toStrictEqual({
        caseReference: "abcd/1234",
        offences: [
          { hoSequenceNumber: 1, addedByCourt: false, pncSequenceNumber: 1 },
          { hoSequenceNumber: 2, addedByCourt: false, pncSequenceNumber: 2 }
        ]
      })
    })

    it("should match multiple offences across different court cases", () => {
      const offence1 = {}
      const offence2 = {
        code: "AC1234",
        disposals: [finalDisposal]
      }
      const offence3 = { code: "AD1234" }
      const matchingSummary = matchOffences(
        [offence1, offence3],
        [{ offences: [offence1] }, { offences: [offence2, offence3] }]
      )
      expect(matchingSummary).toStrictEqual({
        offences: [
          { courtCaseReference: "abcd/1234", hoSequenceNumber: 1, addedByCourt: false, pncSequenceNumber: 1 },
          { courtCaseReference: "efgh/5678", hoSequenceNumber: 2, addedByCourt: false, pncSequenceNumber: 2 }
        ]
      })
    })
  })

  describe("fuzzy matching dates", () => {
    it("should match single offences where everything else matches", () => {
      const hoOffence = { start: new Date("2022-01-02"), end: new Date("2022-01-09") }
      const pncOffence = { end: new Date("2022-01-10") }
      const matchingSummary = matchOffences([hoOffence], [{ offences: [pncOffence] }])
      expect(matchingSummary).toStrictEqual({
        caseReference: "abcd/1234",
        offences: [{ hoSequenceNumber: 1, addedByCourt: false, pncSequenceNumber: 1 }]
      })
    })

    it("should match multiple offences where everything else matches", () => {
      const hoOffence1 = { start: new Date("2022-01-02"), end: new Date("2022-01-09") }
      const hoOffence2 = { code: "AC1234", start: new Date("2022-01-02"), end: new Date("2022-01-09") }
      const pncOffence1 = { end: new Date("2022-01-10") }
      const pncOffence2 = { code: "AC1234", end: new Date("2022-01-10") }
      const matchingSummary = matchOffences([hoOffence1, hoOffence2], [{ offences: [pncOffence1, pncOffence2] }])
      expect(matchingSummary).toStrictEqual({
        caseReference: "abcd/1234",
        offences: [
          { hoSequenceNumber: 1, addedByCourt: false, pncSequenceNumber: 1 },
          { hoSequenceNumber: 2, addedByCourt: false, pncSequenceNumber: 2 }
        ]
      })
    })

    it("should match multiple offences where everything else matches across court cases", () => {
      const hoOffence1 = { start: new Date("2022-01-02"), end: new Date("2022-01-09") }
      const hoOffence2 = { code: "AC1234", start: new Date("2022-01-02"), end: new Date("2022-01-09") }
      const pncOffence1 = { end: new Date("2022-01-10") }
      const pncOffence2 = { code: "AC1234", end: new Date("2022-01-10") }
      const matchingSummary = matchOffences(
        [hoOffence1, hoOffence2],
        [{ offences: [pncOffence1] }, { offences: [pncOffence2] }]
      )
      expect(matchingSummary).toStrictEqual({
        offences: [
          { courtCaseReference: "abcd/1234", hoSequenceNumber: 1, addedByCourt: false, pncSequenceNumber: 1 },
          { courtCaseReference: "efgh/5678", hoSequenceNumber: 2, addedByCourt: false, pncSequenceNumber: 1 }
        ]
      })
    })

    it("should match exact date matches with priority over fuzzy date matches", () => {
      const hoOffence1 = { start: new Date("2022-01-03"), end: new Date("2022-01-07") }
      const hoOffence2 = { start: new Date("2022-01-02"), end: new Date("2022-01-09") }
      const pncOffence1 = { end: new Date("2022-01-10") }
      const pncOffence2 = { start: new Date("2022-01-03"), end: new Date("2022-01-07") }
      const matchingSummary = matchOffences([hoOffence1, hoOffence2], [{ offences: [pncOffence1, pncOffence2] }])
      expect(matchingSummary).toStrictEqual({
        caseReference: "abcd/1234",
        offences: [
          { hoSequenceNumber: 1, addedByCourt: false, pncSequenceNumber: 2 },
          { hoSequenceNumber: 2, addedByCourt: false, pncSequenceNumber: 1 }
        ]
      })
    })

    it("should match offences where the ho end date is missing but start date same as the pnc start and end date", () => {
      const hoOffence = { end: null }
      const pncOffence = {}
      const aho = generateMockAhoWithOffences([hoOffence], [{ offences: [pncOffence] }])
      const result = matchOffencesToPnc(aho)
      const matchingSummary = summariseMatching(result)
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].ActualOffenceDateCode = "1"
      expect(matchingSummary).toStrictEqual({
        caseReference: "abcd/1234",
        offences: [{ hoSequenceNumber: 1, addedByCourt: false, pncSequenceNumber: 1 }]
      })
    })

    it("should match offences where the pnc end date is missing but start date same as the ho start and end date", () => {
      const hoOffence = {}
      const pncOffence = {}
      const matchingSummary = matchOffences([hoOffence], [{ offences: [pncOffence] }])
      expect(matchingSummary).toStrictEqual({
        caseReference: "abcd/1234",
        offences: [{ hoSequenceNumber: 1, addedByCourt: false, pncSequenceNumber: 1 }]
      })
    })
  })

  describe("offences added in court", () => {
    describe("in a single court case with exact matches", () => {
      it("should flag extra ho offences as being added in court if all pnc offences are matched", () => {
        const offence1 = { sequence: 1 }
        const offence2 = { code: "AC1234", sequence: 2 }
        const matchingSummary = matchOffences([offence1, offence2], [{ offences: [offence1] }])
        expect(matchingSummary).toStrictEqual({
          caseReference: "abcd/1234",
          offences: [
            { hoSequenceNumber: 1, addedByCourt: false, pncSequenceNumber: 1 },
            { hoSequenceNumber: 2, addedByCourt: true, pncSequenceNumber: undefined }
          ]
        })
      })

      it("should flag multiple ho offences as being added in court", () => {
        const offence1 = {}
        const offence2 = { code: "AC1234" }
        const offence3 = { code: "AC1234" }
        const matchingSummary = matchOffences([offence1, offence2, offence3], [{ offences: [offence1] }])
        expect(matchingSummary).toStrictEqual({
          caseReference: "abcd/1234",
          offences: [
            { hoSequenceNumber: 1, addedByCourt: false, pncSequenceNumber: 1 },
            { hoSequenceNumber: 2, addedByCourt: true, pncSequenceNumber: undefined },
            { hoSequenceNumber: 3, addedByCourt: true, pncSequenceNumber: undefined }
          ]
        })
      })
    })

    describe("in multiple court cases with inexact matches", () => {
      it("should flag extra ho offences as being added in court if all pnc offences are matched", () => {
        const offence1 = {}
        const offence2 = { code: "AC1234" }
        const offence3 = { code: "AD1234" }
        const matchingSummary = matchOffences(
          [offence1, offence2, offence3],
          [
            { courtCaseReference: "21/abcd/1234", offences: [offence1] },
            { courtCaseReference: "22/efgh/1234", offences: [{ ...offence2 }] }
          ]
        )
        expect(matchingSummary).toStrictEqual({
          offences: [
            { courtCaseReference: "21/abcd/1234", hoSequenceNumber: 1, addedByCourt: false, pncSequenceNumber: 1 },
            { courtCaseReference: "22/efgh/1234", hoSequenceNumber: 2, addedByCourt: false, pncSequenceNumber: 1 },
            {
              courtCaseReference: "21/abcd/1234",
              hoSequenceNumber: 3,
              addedByCourt: true,
              pncSequenceNumber: undefined
            }
          ]
        })
      })

      it("should flag multiple ho offences as being added in court", () => {
        const offence1 = {}
        const offence2 = { code: "AC1234" }
        const offence3 = { code: "AD1234" }
        const offence4 = { code: "AD1234" }

        const matchingSummary = matchOffences(
          [offence1, offence2, offence3, offence4],
          [
            { courtCaseReference: "21/abcd/1234", offences: [offence1] },
            { courtCaseReference: "22/efgh/1234", offences: [offence2] }
          ]
        )
        expect(matchingSummary).toStrictEqual({
          offences: [
            { courtCaseReference: "21/abcd/1234", hoSequenceNumber: 1, addedByCourt: false, pncSequenceNumber: 1 },
            { courtCaseReference: "22/efgh/1234", hoSequenceNumber: 2, addedByCourt: false, pncSequenceNumber: 1 },
            {
              courtCaseReference: "21/abcd/1234",
              hoSequenceNumber: 3,
              addedByCourt: true,
              pncSequenceNumber: undefined
            },
            {
              courtCaseReference: "21/abcd/1234",
              hoSequenceNumber: 4,
              addedByCourt: true,
              pncSequenceNumber: undefined
            }
          ]
        })
      })

      it("should choose the first court case for non-recordable offence categories", () => {
        const offence1 = {}
        const offence2 = { code: "AC1234" }
        const offence3 = { code: "AD1234", category: "EF" }
        const matchingSummary = matchOffences(
          [offence1, offence2, offence3],
          [
            { courtCaseReference: "21/abcd/1234", offences: [offence1] },
            { courtCaseReference: "22/efgh/1234", offences: [{ ...offence2, sequence: 1 }] }
          ]
        )
        expect(matchingSummary).toStrictEqual({
          offences: [
            { courtCaseReference: "21/abcd/1234", hoSequenceNumber: 1, addedByCourt: false, pncSequenceNumber: 1 },
            { courtCaseReference: "22/efgh/1234", hoSequenceNumber: 2, addedByCourt: false, pncSequenceNumber: 1 },
            {
              courtCaseReference: "21/abcd/1234",
              hoSequenceNumber: 3,
              addedByCourt: true,
              pncSequenceNumber: undefined
            }
          ]
        })
      })

      it("should choose the first matching court case with a matched 2060 result for recordable offence categories", () => {
        const offence1 = {}
        const offence2 = { code: "AC1234", resultCodes: [2060] }
        const offence3 = { code: "AD1234" }
        const matchingSummary = matchOffences(
          [offence1, offence2, offence3],
          [
            { courtCaseReference: "21/abcd/1234", offences: [offence1] },
            { courtCaseReference: "22/efgh/1234", offences: [offence2] }
          ]
        )
        expect(matchingSummary).toStrictEqual({
          offences: [
            { courtCaseReference: "21/abcd/1234", hoSequenceNumber: 1, addedByCourt: false, pncSequenceNumber: 1 },
            { courtCaseReference: "22/efgh/1234", hoSequenceNumber: 2, addedByCourt: false, pncSequenceNumber: 1 },
            {
              courtCaseReference: "22/efgh/1234",
              hoSequenceNumber: 3,
              addedByCourt: true,
              pncSequenceNumber: undefined
            }
          ]
        })
      })

      it("should choose the first matching court case without adjudications (after 2060 results) for recordable offence categories", () => {
        const offence1 = { adjudications: [{ verdict: "G", sentenceDate: new Date("2022-01-01") }] }
        const offence2 = { code: "AC1234" }
        const offence3 = { code: "AD1234" }
        const matchingSummary = matchOffences(
          [offence1, offence2, offence3],
          [
            { courtCaseReference: "21/abcd/1234", offences: [offence1] },
            { courtCaseReference: "22/efgh/1234", offences: [offence2] }
          ]
        )
        expect(matchingSummary).toStrictEqual({
          offences: [
            { courtCaseReference: "21/abcd/1234", hoSequenceNumber: 1, addedByCourt: false, pncSequenceNumber: 1 },
            { courtCaseReference: "22/efgh/1234", hoSequenceNumber: 2, addedByCourt: false, pncSequenceNumber: 1 },
            {
              courtCaseReference: "22/efgh/1234",
              hoSequenceNumber: 3,
              addedByCourt: true,
              pncSequenceNumber: undefined
            }
          ]
        })
      })

      it("should choose the first matching court case (after 2060 results and no adjudications) for recordable offence categories", () => {
        const offence1 = { adjudications: [{ verdict: "G" }] }
        const offence2 = { code: "AC1234", adjudications: [{ verdict: "G" }] }
        const offence3 = { code: "AD1234" }
        const matchingSummary = matchOffences(
          [offence1, offence2, offence3],
          [
            { courtCaseReference: "21/abcd/1234", offences: [offence1] },
            { courtCaseReference: "22/efgh/1234", offences: [offence2] }
          ]
        )
        expect(matchingSummary).toStrictEqual({
          offences: [
            { courtCaseReference: "21/abcd/1234", hoSequenceNumber: 1, addedByCourt: false, pncSequenceNumber: 1 },
            { courtCaseReference: "22/efgh/1234", hoSequenceNumber: 2, addedByCourt: false, pncSequenceNumber: 1 },
            {
              courtCaseReference: "21/abcd/1234",
              hoSequenceNumber: 3,
              addedByCourt: true,
              pncSequenceNumber: undefined
            }
          ]
        })
      })
    })

    describe("in a single court case with approximate matches", () => {
      it("should add offences in court for near-identical HO offences if there is a lower number of matching PNC offences", () => {
        const offence1 = {}
        const offence2 = {}
        const matchingSummary = matchOffences([offence1, offence2, offence2], [{ offences: [offence1, offence2] }])
        expect(matchingSummary).toStrictEqual({
          caseReference: "abcd/1234",
          offences: [
            { hoSequenceNumber: 1, addedByCourt: false, pncSequenceNumber: 1 },
            { hoSequenceNumber: 2, addedByCourt: false, pncSequenceNumber: 2 },
            { hoSequenceNumber: 3, addedByCourt: true, pncSequenceNumber: undefined }
          ]
        })
      })
    })
  })

  describe("multiple court cases with a single offence matching", () => {
    it("should match the offence to the correct court case", () => {
      const offence1 = {}
      const offence2 = { code: "AC1234" }
      const matchingSummary = matchOffences([offence2], [{ offences: [offence1] }, { offences: [offence2] }])
      expect(matchingSummary).toStrictEqual({
        caseReference: "efgh/5678",
        offences: [{ hoSequenceNumber: 1, addedByCourt: false, pncSequenceNumber: 1 }]
      })
    })
  })

  describe("matching identical offences", () => {
    it("should match near-identical HO offences successfully if there are an equal number of matching PNC offences", () => {
      const offence1 = {}
      const offence2 = {}
      const matchingSummary = matchOffences([offence1, offence2], [{ offences: [offence1, offence2] }])
      expect(matchingSummary).toStrictEqual({
        caseReference: "abcd/1234",
        offences: [
          { hoSequenceNumber: 1, addedByCourt: false, pncSequenceNumber: 1 },
          { hoSequenceNumber: 2, addedByCourt: false, pncSequenceNumber: 2 }
        ]
      })
    })

    it("should match multiple groups of near-identical HO offences with the same results successfully", () => {
      const offence1 = {}
      const offence2 = { code: "CD1234" }
      const matchingSummary = matchOffences(
        [offence1, offence2, offence1, offence2],
        [{ offences: [offence1, offence1, offence2, offence2] }]
      )
      expect(matchingSummary).toStrictEqual({
        caseReference: "abcd/1234",
        offences: [
          { hoSequenceNumber: 1, addedByCourt: false, pncSequenceNumber: 1 },
          { hoSequenceNumber: 2, addedByCourt: false, pncSequenceNumber: 3 },
          { hoSequenceNumber: 3, addedByCourt: false, pncSequenceNumber: 2 },
          { hoSequenceNumber: 4, addedByCourt: false, pncSequenceNumber: 4 }
        ]
      })
    })

    it("should match near-identical HO offences with the same results successfully across multiple court cases", () => {
      const offence1 = {}
      const matchingSummary = matchOffences([offence1, offence1], [{ offences: [offence1] }, { offences: [offence1] }])
      expect(matchingSummary).toStrictEqual({
        offences: [
          { courtCaseReference: "abcd/1234", hoSequenceNumber: 1, addedByCourt: false, pncSequenceNumber: 1 },
          { courtCaseReference: "efgh/5678", hoSequenceNumber: 2, addedByCourt: false, pncSequenceNumber: 1 }
        ]
      })
    })

    it.todo("should use the conviction date to distinguish between two identical offences")
  })

  describe("manual matches", () => {
    it("should match with a single manual match", () => {
      const offence1 = { resultCodes: [1000] }
      const offence2 = { resultCodes: [2000], manualSequence: 1 }
      const matchingSummary = matchOffences([offence1, offence2], [{ offences: [offence1, offence2] }])
      expect(matchingSummary).toStrictEqual({
        caseReference: "abcd/1234",
        offences: [
          { hoSequenceNumber: 1, addedByCourt: false, pncSequenceNumber: 2 },
          { hoSequenceNumber: 2, addedByCourt: false, pncSequenceNumber: 1 }
        ]
      })
    })

    it("should match with multiple manual matches", () => {
      const offence1 = { resultCodes: [1000], manualSequence: 2 }
      const offence2 = { resultCodes: [2000], manualSequence: 1 }
      const matchingSummary = matchOffences([offence1, offence2], [{ offences: [offence1, offence2] }])
      expect(matchingSummary).toStrictEqual({
        caseReference: "abcd/1234",
        offences: [
          { hoSequenceNumber: 1, addedByCourt: false, pncSequenceNumber: 2 },
          { hoSequenceNumber: 2, addedByCourt: false, pncSequenceNumber: 1 }
        ]
      })
    })

    it("should match with multiple manual matches with manual court case references", () => {
      const offence1 = { resultCodes: [1000], manualSequence: 1 }
      const matchingSummary = matchOffences(
        [
          { ...offence1, manualCourtCase: "23/1234/1234A" },
          { ...offence1, manualCourtCase: "23/4321/1234A" }
        ],
        [
          { courtCaseReference: "23/1234/1234A", offences: [offence1] },
          { courtCaseReference: "23/4321/1234A", offences: [offence1] }
        ]
      )
      expect(matchingSummary).toStrictEqual({
        offences: [
          { courtCaseReference: "23/1234/1234A", hoSequenceNumber: 1, addedByCourt: false, pncSequenceNumber: 1 },
          { courtCaseReference: "23/4321/1234A", hoSequenceNumber: 2, addedByCourt: false, pncSequenceNumber: 1 }
        ]
      })
    })

    it.todo("should not raise an exception if the manual sequence number is empty")

    it.todo("should not raise an exception if the manual ccr is empty")

    it("should match with just the court case reference", () => {
      const offence1 = { resultCodes: [1000], manualCourtCase: "23/1234/1234A" }
      const matchingSummary = matchOffences(
        [offence1],
        [
          { courtCaseReference: "23/4321/1234A", offences: [offence1] },
          { courtCaseReference: "23/1234/1234A", offences: [offence1] }
        ]
      )
      expect(matchingSummary).toStrictEqual({
        caseReference: "23/1234/1234A",
        offences: [{ hoSequenceNumber: 1, addedByCourt: false, pncSequenceNumber: 1 }]
      })
    })

    it.todo("should use conviction date to identify how to match manual sequence number")

    it.todo("should normalise leading zeroes in the manual CCR")

    it.todo("should normalise case in the manual CCR")

    it.todo("should match the most specific manual match first")
  })

  describe("penalty cases", () => {
    it.todo("should match to penalty cases")
  })

  describe("prioritising matching whole cases", () => {
    it("should match a whole case if it can, even if there are conflicts with another case", () => {
      const offence1 = {}
      const offence2 = { code: "CD1234" }
      const matchingSummary = matchOffences(
        [offence1, offence2],
        [{ offences: [offence1, offence2] }, { offences: [offence1, offence1, offence1] }]
      )
      expect(matchingSummary).toStrictEqual({
        caseReference: "abcd/1234",
        offences: [
          { hoSequenceNumber: 1, addedByCourt: false, pncSequenceNumber: 1 },
          { hoSequenceNumber: 2, addedByCourt: false, pncSequenceNumber: 2 }
        ]
      })
    })

    it("should prioritise matching the larger of two cases", () => {
      const offence1 = {}
      const offence2 = { code: "CD1234" }
      const matchingSummary = matchOffences(
        [offence1, offence2],
        [{ offences: [offence1, offence2] }, { offences: [offence1] }]
      )
      expect(matchingSummary).toStrictEqual({
        caseReference: "abcd/1234",
        offences: [
          { hoSequenceNumber: 1, addedByCourt: false, pncSequenceNumber: 1 },
          { hoSequenceNumber: 2, addedByCourt: false, pncSequenceNumber: 2 }
        ]
      })
    })

    it("should raise an exception if there are conficts between two whole case matches", () => {
      const offence1 = {}
      const matchingSummary = matchOffences([offence1], [{ offences: [offence1] }, { offences: [offence1] }])
      expect(matchingSummary).toStrictEqual({
        exceptions: [{ code: "HO100332", path: errorPaths.offence(0).reasonSequence }]
      })
    })

    it("should match to a single case out of multiple cases with the same number of offences", () => {
      const offence1 = {}
      const offence2 = { code: "CD1234" }
      const matchingSummary = matchOffences(
        [offence1, offence2],
        [{ offences: [offence1, offence2] }, { offences: [offence1, offence1] }]
      )
      expect(matchingSummary).toStrictEqual({
        caseReference: "abcd/1234",
        offences: [
          { hoSequenceNumber: 1, addedByCourt: false, pncSequenceNumber: 1 },
          { hoSequenceNumber: 2, addedByCourt: false, pncSequenceNumber: 2 }
        ]
      })
    })

    it.todo("should ignore final offences for full case matching")
  })

  describe("HO100304", () => {
    it("should raise an exception if there aren't any matches at all", () => {
      const offence1 = {}
      const offence2 = { code: "CD5678" }
      const matchingSummary = matchOffences([offence1], [{ offences: [offence2] }])
      expect(matchingSummary).toStrictEqual({ exceptions: [{ code: "HO100304", path: errorPaths.case.asn }] })
    })

    it("should raise an exception if a PNC offence only partially matches a HO offence", () => {
      const offence1 = {}
      const offence2 = { start: new Date("2023-01-01"), end: new Date("2023-01-01") }
      const matchingSummary = matchOffences([offence1], [{ offences: [offence2] }])
      expect(matchingSummary).toStrictEqual({ exceptions: [{ code: "HO100304", path: errorPaths.case.asn }] })
    })

    it("should raise an exception if a court offence matches more than one PNC offence", () => {
      const offence1 = {}
      const offence2 = { code: "AC1234" }
      const matchingSummary = matchOffences([offence1, offence2], [{ offences: [offence1, offence2, offence2] }])
      expect(matchingSummary).toStrictEqual({ exceptions: [{ code: "HO100304", path: errorPaths.case.asn }] })
    })

    it("should raise an exception for near-identical HO offences if there is a greater number of matching PNC offences", () => {
      const offence1 = {}
      const offence2 = {}
      const matchingSummary = matchOffences([offence1, offence2], [{ offences: [offence1, offence2, offence2] }])
      expect(matchingSummary).toStrictEqual({ exceptions: [{ code: "HO100304", path: errorPaths.case.asn }] })
    })

    it("should raise an exception for unmatched pnc offences with a non-final disposal", () => {
      const offence1 = {}
      const offence2 = { code: "AD1234", disposals: [nonFinalDisposal] }
      const matchingSummary = matchOffences([offence1], [{ offences: [offence1, offence2] }])
      expect(matchingSummary).toStrictEqual({ exceptions: [{ code: "HO100304", path: errorPaths.case.asn }] })
    })

    it("should not raise an exception for unmatched pnc offences with a final disposal", () => {
      const offence1 = {}
      const offence2 = { code: "AD1234", disposals: [finalDisposal] }
      const matchingSummary = matchOffences([offence1], [{ offences: [offence1, offence2] }])
      expect(matchingSummary).toStrictEqual({
        caseReference: "abcd/1234",
        offences: [{ hoSequenceNumber: 1, addedByCourt: false, pncSequenceNumber: 1 }]
      })
    })

    it("should raise an exception for near-identical HO offences if there is a greater number of matching PNC offences across multiple court cases", () => {
      const offence1 = {}
      const offence2 = {}
      const matchingSummary = matchOffences(
        [offence1, offence2],
        [{ offences: [offence1, offence2, offence2] }, { offences: [{ ...offence2, sequence: 1 }] }]
      )
      expect(matchingSummary).toStrictEqual({ exceptions: [{ code: "HO100304", path: errorPaths.case.asn }] })
    })
  })

  describe("HO100310", () => {
    it("should raise an exception when there are near-identical offences with non-identical results and there are no exact matches in one court case", () => {
      const offence1 = { resultCodes: [1234] }
      const offence2 = { resultCodes: [5678] }
      const matchingSummary = matchOffences([offence1, offence2], [{ offences: [offence1, offence2] }])
      expect(matchingSummary).toStrictEqual({
        exceptions: [
          { code: "HO100310", path: errorPaths.offence(0).reasonSequence },
          { code: "HO100310", path: errorPaths.offence(1).reasonSequence }
        ]
      })
    })
  })

  describe("HO100312", () => {
    it("should raise an exception when a manual sequence number doesn't match any pnc offences", () => {
      const offence1 = { manualSequence: 2 }
      const matchingSummary = matchOffences([offence1], [{ offences: [offence1] }])
      expect(matchingSummary).toStrictEqual({
        exceptions: [{ code: "HO100312", path: errorPaths.offence(0).reasonSequence }]
      })
    })
  })

  describe("HO100320", () => {
    it("should raise an exception when a manual sequence number identifies a non-matching PNC offence", () => {
      const offence1 = { manualSequence: 1 }
      const matchingSummary = matchOffences([offence1], [{ offences: [{ ...offence1, code: "CD1234" }] }])
      expect(matchingSummary).toStrictEqual({
        exceptions: [{ code: "HO100320", path: errorPaths.offence(0).reasonSequence }]
      })
    })
  })

  describe("HO100328", () => {
    it.todo("should raise exception when penalty and court cases are matched")
  })

  describe("HO100329", () => {
    it.todo("should raise exception when there's more than one penalty case match")
  })

  describe("HO100332", () => {
    it("should raise an exception when there are near-identical offences with different results and there are no exact matches in multiple court cases", () => {
      const offence = {}
      const matchingSummary = matchOffences(
        [offence, { ...offence, resultCodes: [1000] }],
        [{ offences: [offence] }, { offences: [offence] }]
      )
      expect(matchingSummary).toStrictEqual({
        exceptions: [
          { code: "HO100332", path: errorPaths.offence(0).reasonSequence },
          { code: "HO100332", path: errorPaths.offence(1).reasonSequence }
        ]
      })
    })

    it("should raise an exception when an offence matches multiple pnc offences across multiple court cases", () => {
      const offence1 = { resultCodes: [1234] }
      const matchingSummary = matchOffences([offence1], [{ offences: [offence1] }, { offences: [offence1] }])
      expect(matchingSummary).toStrictEqual({
        exceptions: [{ code: "HO100332", path: errorPaths.offence(0).reasonSequence }]
      })
    })

    it("should raise an exception when there are near-identical offences with non-identical results in multiple court cases", () => {
      const offence1 = { resultCodes: [1234] }
      const offence2 = { resultCodes: [5678] }
      const matchingSummary = matchOffences([offence1, offence2], [{ offences: [offence1] }, { offences: [offence2] }])
      expect(matchingSummary).toStrictEqual({
        exceptions: [
          { code: "HO100332", path: errorPaths.offence(0).reasonSequence },
          { code: "HO100332", path: errorPaths.offence(1).reasonSequence }
        ]
      })
    })
  })

  describe("HO100333", () => {
    it.todo("should raise exception when manual CCR doesn't match any CCRs on PNC")
  })

  describe("HO100507", () => {
    it.todo("should raise exception when there are unmatched HO offences for a penalty case")
  })
})
