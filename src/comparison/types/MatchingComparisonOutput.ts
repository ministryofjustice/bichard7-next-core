import type { OffenceReason } from "src/types/AnnotatedHearingOutcome"
import type Exception from "src/types/Exception"

export type ResultSummary = {
  CJSresultCode: number
}

export type OffenceSummary = {
  CourtOffenceSequenceNumber: number
  CriminalProsecutionReference: {
    OffenceReason?: OffenceReason
  }
  Result: ResultSummary[]
  ActualOffenceStartDate: { StartDate: Date }
  ActualOffenceEndDate?: { EndDate: Date }
}

export type CourtResultSummary = {
  AnnotatedHearingOutcome: {
    HearingOutcome: {
      Hearing: {
        DateOfHearing: Date
      }
      Case: {
        HearingDefendant: {
          Offence: OffenceSummary[]
        }
      }
    }
  }
}

export type PncOffenceSummary = {
  offence: {
    sequenceNumber: number
    cjsOffenceCode: string
    startDate: Date
    endDate?: Date
  }
}

export type PncCourtCaseSummary = {
  courtCaseReference: string
  offences: PncOffenceSummary[]
}

export type PncPenaltyCaseSummary = {
  penaltyCaseReference: string
  offences: PncOffenceSummary[]
}

export type PncSummary = {
  courtCases?: PncCourtCaseSummary[]
  penaltyCases?: PncPenaltyCaseSummary[]
}

export type OffenceMatchingSummary = {
  hoSequenceNumber: number
  offenceCode?: string
  courtCaseReference?: string | null
  addedByCourt?: boolean
  pncSequenceNumber?: number
}

export type CourtResultMatchingSummary =
  | {
      courtCaseReference?: string | null
      offences: OffenceMatchingSummary[]
    }
  | {
      exceptions: Exception[]
    }

export type MatchingComparisonOutput = {
  courtResult: CourtResultSummary
  pnc?: PncSummary
  matching: CourtResultMatchingSummary | null
  exceptions: Exception[]
  file: string
}
