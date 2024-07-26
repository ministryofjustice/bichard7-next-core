import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type { PncQueryResult } from "../../types/PncQueryResult"
import { datesAreDifferent, findMatchingPncOffence } from "./TRPR0018"

const generateMockAho = (
  offenceReasonSequence: string,
  courtCaseReferenceNumber: string,
  startDate: Date,
  endDate: Date
) =>
  ({
    AnnotatedHearingOutcome: {
      HearingOutcome: {
        Case: {
          HearingDefendant: {
            Offence: [
              {
                CriminalProsecutionReference: {
                  OffenceReasonSequence: offenceReasonSequence
                },
                CourtCaseReferenceNumber: courtCaseReferenceNumber,
                ActualOffenceStartDate: { StartDate: startDate },
                ActualOffenceEndDate: { EndDate: endDate }
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
  courtCaseReference: string | undefined,
  penaltyCaseReference: string | undefined,
  sqn1: number,
  sqn2: number,
  startDate: Date,
  endDate: Date
) =>
  ({
    ...(includeCourtCases
      ? {
          courtCases: [
            {
              courtCaseReference: courtCaseReference,
              offences: [
                { offence: { sequenceNumber: sqn1, startDate: startDate, endDate: endDate } },
                { offence: { sequenceNumber: sqn2, startDate: startDate, endDate: endDate } }
              ]
            }
          ]
        }
      : {}),
    ...(includePenaltyCases
      ? {
          penaltyCases: [
            {
              penaltyCaseReference: penaltyCaseReference,
              offences: [
                { offence: { sequenceNumber: sqn1, startDate: startDate, endDate: endDate } },
                { offence: { sequenceNumber: sqn2, startDate: startDate, endDate: endDate } }
              ]
            }
          ]
        }
      : {})
  }) as PncQueryResult

const offenceReasonSequence = "001"
const startDate = new Date(2010, 10, 28)
const endDate = new Date(2010, 11, 28)
const courtCaseReference = "97/1626/008395Q"

describe("findMatchingPncOffence", () => {
  it("Should find matching PNC offence when pnc query has a court case field but no penalty case", () => {
    const pncQuery = generateMockPncQuery(true, false, courtCaseReference, undefined, 1, 2, startDate, endDate)
    const ahoOffence = generateMockAho(offenceReasonSequence, courtCaseReference, startDate, endDate)
      .AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0]

    const result = findMatchingPncOffence(pncQuery, undefined, ahoOffence)
    expect(result).toEqual({
      offence: { sequenceNumber: 1, startDate: startDate, endDate: endDate }
    })
  })

  it("Should find matching PNC offence when pnc query has a penalty case field but no court case", () => {
    const pncQuery = generateMockPncQuery(false, true, undefined, courtCaseReference, 1, 2, startDate, endDate)
    const ahoOffence = generateMockAho(offenceReasonSequence, courtCaseReference, startDate, endDate)
      .AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0]

    const result = findMatchingPncOffence(pncQuery, undefined, ahoOffence)
    expect(result).toEqual({
      offence: { sequenceNumber: 1, startDate: startDate, endDate: endDate }
    })
  })
})

describe("datesAreDifferent", () => {
  it("Should return true as start dates do not match", () => {
    const pncOffence = generateMockPncQuery(false, true, undefined, courtCaseReference, 1, 2, startDate, endDate)
      .penaltyCases?.[0].offences[0].offence
    const ahoOffence = generateMockAho(offenceReasonSequence, courtCaseReference, new Date(2010, 10, 27), endDate)
      .AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0]

    const result = datesAreDifferent(ahoOffence, pncOffence)

    expect(result).toBe(true)
  })
})
