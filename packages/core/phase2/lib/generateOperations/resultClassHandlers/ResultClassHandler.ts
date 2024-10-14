import type { AnnotatedHearingOutcome, Offence, Result } from "../../../../types/AnnotatedHearingOutcome"
import type { Operation } from "../../../../types/PncUpdateDataset"

export type ResultClassHandlerParams = {
  aho: AnnotatedHearingOutcome
  offence: Offence
  result: Result
  resubmitted: boolean
  allResultsOnPnc: boolean
}

export type ResultClassHandler = (params: ResultClassHandlerParams) => Operation[]
