import type Exception from "src/types/Exception"

export type CourtResultSummary = {
  dateOfHearing: Date
  defendant: {
    offences: {
      sequenceNumber: number
      offenceCode: string
      resultCodes: number[]
      startDate: Date
      endDate?: Date
    }[]
  }
}

export type PncSummary = {
  courtCases?: {
    reference: string
    offences: {
      sequenceNumber: number
      offenceCode: string
      startDate: Date
      endDate?: Date
    }[]
  }[]
}

export type CourtResultMatchingSummary = {
  courtCaseReference?: string | null
  defendant: {
    offences: {
      hoSequenceNumber: number
      courtCaseReference?: string | null
      addedByCourt?: boolean
      pncSequenceNumber?: number
    }[]
  }
}

export type MatchingComparisonOutput = {
  courtResult: CourtResultSummary
  pnc?: PncSummary
  matching: CourtResultMatchingSummary | null
  exceptions: Exception[]
  file: string
}
