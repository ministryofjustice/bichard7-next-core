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
const courtOffenceSequenceNumber = 1

const testCases = [
  {
    description: "generate trigger when AHO has Offence reason sequence, dates different, PNC has matching court case",
    aho: generateMockAho(true, startDate, endDate),
    pncQuery: generateMockPncQuery(true, false, new Date(2010, 10, 27), endDate),
    expected: [{ code: triggerCode, offenceSequenceNumber: courtOffenceSequenceNumber }]
  },
  {
    description: "not generate trigger when AHO has Offence reason sequence, dates same, PNC has matching court case",
    aho: generateMockAho(true, startDate, endDate),
    pncQuery: generateMockPncQuery(true, false, startDate, endDate),
    expected: []
  },
  {
    description:
      "generate trigger when AHO has Offence reason sequence, dates different, PNC has matching penalty case",
    aho: generateMockAho(true, startDate, endDate),
    pncQuery: generateMockPncQuery(false, true, new Date(2010, 10, 27), endDate),
    expected: [{ code: triggerCode, offenceSequenceNumber: courtOffenceSequenceNumber }]
  },
  {
    description: "not generate trigger when AHO has Offence reason sequence, dates same, PNC has matching penalty case",
    aho: generateMockAho(true, startDate, endDate),
    pncQuery: generateMockPncQuery(false, true, startDate, endDate),
    expected: []
  },
  {
    description:
      "not generate trigger when AHO doesn't have Offence reason sequence, dates different, PNC has matching court case",
    aho: generateMockAho(false, startDate, endDate),
    pncQuery: generateMockPncQuery(true, false, new Date(2010, 10, 27), endDate),
    expected: []
  },
  {
    description:
      "not generate trigger when AHO doesn't have Offence reason sequence, dates same, PNC has matching court case",
    aho: generateMockAho(false, startDate, endDate),
    pncQuery: generateMockPncQuery(true, false, startDate, endDate),
    expected: []
  },
  {
    description:
      "not generate trigger when AHO doesn't have Offence reason sequence, dates different, PNC has matching penalty case",
    aho: generateMockAho(false, startDate, endDate),
    pncQuery: generateMockPncQuery(false, true, new Date(2010, 10, 27), endDate),
    expected: []
  },
  {
    description:
      "not generate trigger when AHO doesn't have Offence reason sequence, dates same, PNC has matching penalty case",
    aho: generateMockAho(false, startDate, endDate),
    pncQuery: generateMockPncQuery(false, true, startDate, endDate),
    expected: []
  },
  {
    description: "generate trigger when Offence start dates match but end dates are different",
    aho: generateMockAho(true, startDate, endDate),
    pncQuery: generateMockPncQuery(true, false, startDate, new Date(2010, 11, 27)),
    expected: [{ code: triggerCode, offenceSequenceNumber: courtOffenceSequenceNumber }]
  },
  {
    description: "not generate trigger when Both start and end dates match",
    aho: generateMockAho(true, startDate, endDate),
    pncQuery: generateMockPncQuery(true, false, startDate, endDate),
    expected: []
  },
  {
    description: "not generate trigger when PNC query has no matching court or penalty cases",
    aho: generateMockAho(true, startDate, endDate),
    pncQuery: generateMockPncQuery(false, false, startDate, endDate),
    expected: []
  },
  {
    description: "generate trigger when there is an offence match in penalty cases",
    aho: generateMockAho(true, startDate, endDate),
    pncQuery: generateMockPncQuery(false, true, new Date(2010, 10, 27), endDate),
    expected: [{ code: triggerCode, offenceSequenceNumber: courtOffenceSequenceNumber }]
  }
]

describe("TRPR0018", () => {
  testCases.forEach(({ description, aho, pncQuery, expected }) => {
    it(`Should ${description}`, () => {
      const result = TRPR0018({ ...aho, PncQuery: { ...pncQuery } })
      expect(result).toEqual(expected)
    })
  })
})
