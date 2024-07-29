import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type { PncOffence, PncQueryResult } from "../../types/PncQueryResult"
import TRPR0018, { datesAreDifferent, findMatchingPncOffence } from "./TRPR0018"

const generateMockAho = (hasOffenceReasonSequence: boolean, startDate: Date, endDate: Date) =>
  ({
    AnnotatedHearingOutcome: {
      HearingOutcome: {
        Case: {
          HearingDefendant: {
            Offence: [
              {
                CriminalProsecutionReference: {
                  ...(hasOffenceReasonSequence ? { OffenceReasonSequence: "001" } : {})
                },
                CourtCaseReferenceNumber: "97/1626/008395Q",
                ActualOffenceStartDate: { StartDate: startDate },
                ActualOffenceEndDate: { EndDate: endDate },
                CourtOffenceSequenceNumber: 1
              }
            ]
          }
        }
      }
    }
  }) as unknown as AnnotatedHearingOutcome

const generateMockPncQuery = (
  includeCourtCases: boolean,
  includePenaltyCases: boolean,
  startDate: Date,
  endDate: Date
) =>
  ({
    ...(includeCourtCases
      ? {
          courtCases: [
            {
              courtCaseReference: "97/1626/008395Q",
              offences: [
                { offence: { sequenceNumber: 1, startDate: startDate, endDate: endDate } },
                { offence: { sequenceNumber: 2, startDate: startDate, endDate: endDate } }
              ]
            }
          ]
        }
      : {}),
    ...(includePenaltyCases
      ? {
          penaltyCases: [
            {
              penaltyCaseReference: "97/1626/008395Q",
              offences: [
                { offence: { sequenceNumber: 1, startDate: startDate, endDate: endDate } },
                { offence: { sequenceNumber: 2, startDate: startDate, endDate: endDate } }
              ]
            }
          ]
        }
      : {})
  }) as PncQueryResult

const startDate = new Date(2010, 10, 28)
const endDate = new Date(2010, 11, 28)
const triggerCode = TriggerCode.TRPR0018

describe("findMatchingPncOffence", () => {
  it("Should find matching PNC offence when pnc query has a court case field but no penalty case", () => {
    const pncQuery = generateMockPncQuery(true, false, startDate, endDate)
    const ahoOffence = generateMockAho(true, startDate, endDate).AnnotatedHearingOutcome.HearingOutcome.Case
      .HearingDefendant.Offence[0]

    const result = findMatchingPncOffence(pncQuery, undefined, ahoOffence)
    expect(result).toEqual({
      offence: { sequenceNumber: 1, startDate: startDate, endDate: endDate }
    })
  })

  it("Should find matching PNC offence when pnc query has a penalty case field but no court case", () => {
    const pncQuery = generateMockPncQuery(true, false, startDate, endDate)
    const ahoOffence = generateMockAho(true, startDate, endDate).AnnotatedHearingOutcome.HearingOutcome.Case
      .HearingDefendant.Offence[0]

    const result = findMatchingPncOffence(pncQuery, undefined, ahoOffence)
    expect(result).toEqual({
      offence: { sequenceNumber: 1, startDate: startDate, endDate: endDate }
    })
  })
})

describe("datesAreDifferent", () => {
  it("Should return true as start dates do not match", () => {
    const pncOffence = generateMockPncQuery(false, true, startDate, endDate).penaltyCases?.[0]
      .offences[0] as unknown as PncOffence
    const ahoOffence = generateMockAho(true, new Date(2010, 10, 27), endDate).AnnotatedHearingOutcome.HearingOutcome
      .Case.HearingDefendant.Offence[0]

    const result = datesAreDifferent(ahoOffence, pncOffence)

    expect(result).toBe(true)
  })

  it("Should return false as start dates match", () => {
    const pncOffence = generateMockPncQuery(false, true, startDate, endDate).penaltyCases?.[0]
      .offences[0] as unknown as PncOffence
    const ahoOffence = generateMockAho(true, startDate, endDate).AnnotatedHearingOutcome.HearingOutcome.Case
      .HearingDefendant.Offence[0]

    const result = datesAreDifferent(ahoOffence, pncOffence)

    expect(result).toBe(false)
  })
})

describe("TRPR0018", () => {
  const aho = generateMockAho(true, startDate, endDate)
  const courtOffenceSequenceNumber =
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].CourtOffenceSequenceNumber

  it("Should generate a trigger when the aho has an OffenceReasonSequence and the dates are different", () => {
    const pncQuery = generateMockPncQuery(true, false, new Date(2010, 10, 27), endDate)
    const result = TRPR0018({ ...aho, PncQuery: { ...pncQuery } })

    expect(result).toEqual([{ code: triggerCode, offenceSequenceNumber: courtOffenceSequenceNumber }])
  })

  it("Should not generate a trigger when the aho has an OffenceReasonSequence and the dates are the same", () => {
    const pncQuery = generateMockPncQuery(true, false, startDate, endDate)
    const result = TRPR0018({ ...aho, PncQuery: { ...pncQuery } })

    expect(result).toEqual([])
  })

  it("Should not generate a trigger when the aho doesn't have an OffenceReasonSequence and the dates are different", () => {
    const noOffenceReasonSequenceAho = generateMockAho(false, startDate, endDate)
    const pncQuery = generateMockPncQuery(true, false, new Date(2010, 10, 27), endDate)
    const result = TRPR0018({ ...noOffenceReasonSequenceAho, PncQuery: { ...pncQuery } })

    expect(result).toEqual([])
  })

  it("Should not generate a trigger when there is no PNC offence", () => {
    const pncQuery = generateMockPncQuery(false, false, startDate, endDate)
    const result = TRPR0018({ ...aho, PncQuery: { ...pncQuery } })

    expect(result).toEqual([])
  })
})
