import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type { PncQueryResult } from "../../types/PncQueryResult"

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
  courtCaseReference: string | null,
  penaltyCaseReference: string | null,
  sqn1: number,
  sqn2: number,
  startDate: Date,
  endDate: Date
) =>
  ({
    PncQuery: {
      ...(courtCaseReference
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
      ...(penaltyCaseReference
        ? {
            penaltyCases: [
              {
                penaltyCaseReference: penaltyCaseReference,
                offences: [{ offence: { sequenceNumber: sqn1 } }, { offence: { sequenceNumber: sqn2 } }]
              }
            ]
          }
        : {})
    }
  }) as unknown as PncQueryResult

describe("TRPR0018", () => {})
