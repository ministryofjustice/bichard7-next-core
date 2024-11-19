import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"

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
                ActualOffenceEndDate: { EndDate: endDate },
                ActualOffenceStartDate: { StartDate: startDate },
                CourtCaseReferenceNumber: "97/1626/008395Q",
                CourtOffenceSequenceNumber: 1,
                CriminalProsecutionReference: {
                  ...(hasOffenceReasonSequence ? { OffenceReasonSequence: "001" } : {})
                }
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
                { offence: { endDate: endDate, sequenceNumber: 1, startDate: startDate } },
                { offence: { endDate: endDate, sequenceNumber: 2, startDate: startDate } }
              ]
            }
          ]
        }
      : {}),
    ...(includePenaltyCases
      ? {
          penaltyCases: [
            {
              offences: [
                { offence: { endDate: endDate, sequenceNumber: 1, startDate: startDate } },
                { offence: { endDate: endDate, sequenceNumber: 2, startDate: startDate } }
              ],
              penaltyCaseReference: "97/1626/008395Q"
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
    aho: generateMockAho(true, startDate, endDate),
    description: "generate trigger when AHO has Offence reason sequence, dates different, PNC has matching court case",
    expected: [{ code: triggerCode, offenceSequenceNumber: courtOffenceSequenceNumber }],
    pncQuery: generateMockPncQuery(true, false, new Date(2010, 10, 27), endDate)
  },
  {
    aho: generateMockAho(true, startDate, endDate),
    description: "not generate trigger when AHO has Offence reason sequence, dates same, PNC has matching court case",
    expected: [],
    pncQuery: generateMockPncQuery(true, false, startDate, endDate)
  },
  {
    aho: generateMockAho(true, startDate, endDate),
    description:
      "generate trigger when AHO has Offence reason sequence, dates different, PNC has matching penalty case",
    expected: [{ code: triggerCode, offenceSequenceNumber: courtOffenceSequenceNumber }],
    pncQuery: generateMockPncQuery(false, true, new Date(2010, 10, 27), endDate)
  },
  {
    aho: generateMockAho(true, startDate, endDate),
    description: "not generate trigger when AHO has Offence reason sequence, dates same, PNC has matching penalty case",
    expected: [],
    pncQuery: generateMockPncQuery(false, true, startDate, endDate)
  },
  {
    aho: generateMockAho(false, startDate, endDate),
    description:
      "not generate trigger when AHO doesn't have Offence reason sequence, dates different, PNC has matching court case",
    expected: [],
    pncQuery: generateMockPncQuery(true, false, new Date(2010, 10, 27), endDate)
  },
  {
    aho: generateMockAho(false, startDate, endDate),
    description:
      "not generate trigger when AHO doesn't have Offence reason sequence, dates same, PNC has matching court case",
    expected: [],
    pncQuery: generateMockPncQuery(true, false, startDate, endDate)
  },
  {
    aho: generateMockAho(false, startDate, endDate),
    description:
      "not generate trigger when AHO doesn't have Offence reason sequence, dates different, PNC has matching penalty case",
    expected: [],
    pncQuery: generateMockPncQuery(false, true, new Date(2010, 10, 27), endDate)
  },
  {
    aho: generateMockAho(false, startDate, endDate),
    description:
      "not generate trigger when AHO doesn't have Offence reason sequence, dates same, PNC has matching penalty case",
    expected: [],
    pncQuery: generateMockPncQuery(false, true, startDate, endDate)
  },
  {
    aho: generateMockAho(true, startDate, endDate),
    description: "generate trigger when Offence start dates match but end dates are different",
    expected: [{ code: triggerCode, offenceSequenceNumber: courtOffenceSequenceNumber }],
    pncQuery: generateMockPncQuery(true, false, startDate, new Date(2010, 11, 27))
  },
  {
    aho: generateMockAho(true, startDate, endDate),
    description: "not generate trigger when Both start and end dates match",
    expected: [],
    pncQuery: generateMockPncQuery(true, false, startDate, endDate)
  },
  {
    aho: generateMockAho(true, startDate, endDate),
    description: "not generate trigger when PNC query has no matching court or penalty cases",
    expected: [],
    pncQuery: generateMockPncQuery(false, false, startDate, endDate)
  },
  {
    aho: generateMockAho(true, startDate, endDate),
    description: "generate trigger when there is an offence match in penalty cases",
    expected: [{ code: triggerCode, offenceSequenceNumber: courtOffenceSequenceNumber }],
    pncQuery: generateMockPncQuery(false, true, new Date(2010, 10, 27), endDate)
  }
]

describe("TRPR0018", () => {
  testCases.forEach(({ aho, description, expected, pncQuery }) => {
    it(`Should ${description}`, () => {
      const result = TRPR0018({ ...aho, PncQuery: { ...pncQuery } })
      expect(result).toEqual(expected)
    })
  })
})
