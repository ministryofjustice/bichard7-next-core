import type { DisplayFullCourtCase } from "types/display/CourtCases"

export type ResultVisibilityMap = {
  [offenceIndex: number]: {
    [resultIndex: number]: boolean
  }
}

export const initialResultsVisibility = (
  offencesCount: number,
  courtCase: DisplayFullCourtCase
): ResultVisibilityMap => {
  const initialState: ResultVisibilityMap = {}
  Array.from({ length: offencesCount }).forEach((_, offenceIdx) => {
    const hearingResultsVisibility: { [key: number]: boolean } = {}
    const offenceResults =
      courtCase.aho.AnnotatedHearingOutcome.HearingOutcome.Case?.HearingDefendant?.Offence[offenceIdx].Result

    offenceResults.forEach((_, resultIdx) => {
      hearingResultsVisibility[resultIdx] = true
    })

    initialState[offenceIdx] = hearingResultsVisibility
  })
  return initialState
}
