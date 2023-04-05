import errorPaths from "src/lib/errorPaths"
import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"
import summariseMatching from "tests/helpers/summariseMatching"
import matchOffencesToPnc from "./matchOffencesToPnc"

type OffenceData = {
  code: string
  start: Date
  end: Date
  sequence: number
  resultCodes?: number[]
}

type PncCourtCaseData = {
  courtCaseReference: string
  offences: OffenceData[]
}

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
                }
              },
              ActualOffenceStartDate: {
                StartDate: o.start
              },
              ActualOffenceEndDate: {
                EndDate: o.end
              },
              CourtOffenceSequenceNumber: o.sequence,
              Result: (o.resultCodes ?? [1234]).map((CJSresultCode) => ({ CJSresultCode }))
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
          }
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

    it("should prioritise matching fully matching offences", () => {
      const offence1 = { code: "AB1234", start: new Date("2022-01-01"), end: new Date("2022-01-01"), sequence: 1 }
      const offence2 = { code: "AC1234", start: new Date("2022-01-01"), end: new Date("2022-01-01"), sequence: 2 }
      const aho = generateMockAhoWithOffences(
        [offence1, offence2],
        [{ courtCaseReference: "abcd/1234", offences: [offence1, { ...offence2, sequence: 3 }] }]
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
        [{ ...offence1, sequence: 3 }, offence2],
        [
          { courtCaseReference: "abcd/1234", offences: [{ ...offence1, sequence: 2 }, offence2] },
          { courtCaseReference: "efgh/1234", offences: [{ ...offence1, sequence: 1 }] }
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
  })

  describe("HO100310", () => {
    it("should raise an exception when there are near-identical offences with non-identical results", () => {
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
  })
})
