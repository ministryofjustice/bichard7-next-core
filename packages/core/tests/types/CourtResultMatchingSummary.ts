import type Exception from "../../types/Exception"

type CourtResultMatchingSummary =
  | {
      caseReference?: null | string
      offences: OffenceMatchingSummary[]
    }
  | {
      exceptions: Exception[]
    }

type OffenceMatchingSummary = {
  addedByCourt?: boolean
  courtCaseReference?: null | string
  hoSequenceNumber: number
  offenceCode?: string
  pncSequenceNumber?: number
}

export default CourtResultMatchingSummary
