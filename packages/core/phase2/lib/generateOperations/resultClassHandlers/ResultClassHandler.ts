import type { AnnotatedHearingOutcome, Offence, Result } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import type { Operation } from "@moj-bichard7/common/types/PncUpdateDataset"

export type ResultClassHandler = (params: ResultClassHandlerParams) => Operation[]

export type ResultClassHandlerParams = {
  aho: AnnotatedHearingOutcome
  areAllResultsInPoliceCourtCase: boolean
  offence: Offence
  resubmitted: boolean
  result: Result
}
