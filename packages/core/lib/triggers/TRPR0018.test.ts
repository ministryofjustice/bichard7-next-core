import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type { PncQueryResult } from "../../types/PncQueryResult"
import TRPR0018 from "./TRPR0018"

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

describe("TRPR0018", () => {
  const courtOffenceSequenceNumber = 1

  it("Should generate a trigger when the AHO has an OffenceReasonSequence and the dates are different", () => {
    const pncQuery = generateMockPncQuery(true, false, new Date(2010, 10, 27), endDate)
    const aho = generateMockAho(true, startDate, endDate)
    const result = TRPR0018({ ...aho, PncQuery: { ...pncQuery } })
    expect(result).toEqual([{ code: triggerCode, offenceSequenceNumber: courtOffenceSequenceNumber }])
  })

  it("Should not generate a trigger when the AHO has an OffenceReasonSequence and the dates are the same", () => {
    const pncQuery = generateMockPncQuery(true, false, startDate, endDate)
    const aho = generateMockAho(true, startDate, endDate)
    const result = TRPR0018({ ...aho, PncQuery: { ...pncQuery } })
    expect(result).toEqual([])
  })

  it("Should not generate a trigger when the AHO doesn't have an OffenceReasonSequence and the dates are different", () => {
    const pncQuery = generateMockPncQuery(true, false, new Date(2010, 10, 27), endDate)
    const aho = generateMockAho(false, startDate, endDate)
    const result = TRPR0018({ ...aho, PncQuery: { ...pncQuery } })
    expect(result).toEqual([])
  })

  it("Should not generate a trigger when the AHO doesn't have an OffenceReasonSequence and the dates are the same", () => {
    const pncQuery = generateMockPncQuery(true, false, startDate, endDate)
    const aho = generateMockAho(false, startDate, endDate)
    const result = TRPR0018({ ...aho, PncQuery: { ...pncQuery } })
    expect(result).toEqual([])
  })

  it("Should not generate a trigger when there is no matching PNC offence", () => {
    const pncQuery = generateMockPncQuery(false, false, startDate, endDate)
    const aho = generateMockAho(true, startDate, endDate)
    const result = TRPR0018({ ...aho, PncQuery: { ...pncQuery } })
    expect(result).toEqual([])
  })

  it("Should generate a trigger when AHO and PNC Query offence start dates are different and end dates are different", () => {
    const pncQuery = generateMockPncQuery(true, false, new Date(2010, 10, 27), new Date(2010, 11, 27))
    const aho = generateMockAho(true, startDate, endDate)
    const result = TRPR0018({ ...aho, PncQuery: { ...pncQuery } })
    expect(result).toEqual([{ code: triggerCode, offenceSequenceNumber: courtOffenceSequenceNumber }])
  })

  it("Should generate a trigger when AHO and PNC Query offence start dates match but end dates are different", () => {
    const pncQuery = generateMockPncQuery(true, false, startDate, new Date(2010, 11, 27))
    const aho = generateMockAho(true, startDate, endDate)
    const result = TRPR0018({ ...aho, PncQuery: { ...pncQuery } })
    expect(result).toEqual([{ code: triggerCode, offenceSequenceNumber: courtOffenceSequenceNumber }])
  })

  it("Should not generate a trigger when both start and end dates match", () => {
    const pncQuery = generateMockPncQuery(true, false, startDate, endDate)
    const aho = generateMockAho(true, startDate, endDate)
    const result = TRPR0018({ ...aho, PncQuery: { ...pncQuery } })
    expect(result).toEqual([])
  })
  it("Should not generate a trigger when PNC query has no matching court or penalty cases", () => {
    const pncQuery = generateMockPncQuery(false, false, startDate, endDate)
    const aho = generateMockAho(true, startDate, endDate)
    const result = TRPR0018({ ...aho, PncQuery: { ...pncQuery } })
    expect(result).toEqual([])
  })

  it("Should generate a trigger when there is a matching offence in penalty cases", () => {
    const pncQuery = generateMockPncQuery(false, true, new Date(2010, 10, 27), endDate)
    const aho = generateMockAho(true, startDate, endDate)
    const result = TRPR0018({ ...aho, PncQuery: { ...pncQuery } })
    expect(result).toEqual([{ code: triggerCode, offenceSequenceNumber: courtOffenceSequenceNumber }])
  })
})
