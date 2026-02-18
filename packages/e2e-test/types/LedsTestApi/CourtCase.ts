import type { NonEmptyOffenceDetailsArray } from "./OffenceDetails"
import type { Court } from "./Requests/Disposals"

type CourtCase = {
  convictionDate: string
  court: Court
  offences: NonEmptyOffenceDetailsArray
}

export type NonEmptyCourtCaseArray = [CourtCase, ...CourtCase[]]

export default CourtCase
