import type { AnnotatedHearingOutcome, Offence, Result } from "../../../../types/AnnotatedHearingOutcome"
import type { Operation } from "../../../../types/PncUpdateDataset"

export type ResultClassHandlerParams = {
  aho: AnnotatedHearingOutcome
  areAllResultsOnPnc: boolean
  offence: Offence
  resubmitted: boolean
  result: Result
}

export type ResultClassHandler = (params: ResultClassHandlerParams) => Operation[]
