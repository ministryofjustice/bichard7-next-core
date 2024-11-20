import type { OffenceReason } from "../../types/AnnotatedHearingOutcome"
import type Exception from "../../types/Exception"

export type ResultSummary = {
  CJSresultCode: number
}

export type OffenceSummary = {
  ActualOffenceEndDate?: { EndDate: Date }
  ActualOffenceStartDate: { StartDate: Date }
  CourtOffenceSequenceNumber: number
  CriminalProsecutionReference: {
    OffenceReason?: OffenceReason
  }
  Result: ResultSummary[]
}

export type CourtResultSummary = {
  AnnotatedHearingOutcome: {
    HearingOutcome: {
      Case: {
        HearingDefendant: {
          Offence: OffenceSummary[]
        }
      }
      Hearing: {
        DateOfHearing: Date
      }
    }
  }
}

export type PncOffenceSummary = {
  offence: {
    cjsOffenceCode: string
    endDate?: Date
    sequenceNumber: number
    startDate: Date
  }
}

export type PncCourtCaseSummary = {
  courtCaseReference: string
  offences: PncOffenceSummary[]
}

export type PncPenaltyCaseSummary = {
  offences: PncOffenceSummary[]
  penaltyCaseReference: string
}

export type PncSummary = {
  courtCases?: PncCourtCaseSummary[]
  penaltyCases?: PncPenaltyCaseSummary[]
}

export type OffenceMatchingSummary = {
  addedByCourt?: boolean
  courtCaseReference?: null | string
  hoSequenceNumber: number
  offenceCode?: string
  pncSequenceNumber?: number
}

export type CourtResultMatchingSummary =
  | {
      caseReference?: null | string
      offences: OffenceMatchingSummary[]
    }
  | {
      exceptions: Exception[]
    }

export type MatchingComparisonOutput = {
  courtResult: CourtResultSummary
  exceptions: Exception[]
  file: string
  matching: CourtResultMatchingSummary | null
  pnc?: PncSummary
}
