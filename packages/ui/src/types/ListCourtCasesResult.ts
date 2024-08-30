import type CourtCase from "../services/entities/CourtCase"

export type ListCourtCaseResult = {
  result: CourtCase[]
  totalCases: number
}
