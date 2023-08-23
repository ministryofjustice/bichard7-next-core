import type CourtCase from "src/services/entities/CourtCase"

export type ListCourtCaseResult = {
  result: CourtCase[]
  totalCases: number
}
