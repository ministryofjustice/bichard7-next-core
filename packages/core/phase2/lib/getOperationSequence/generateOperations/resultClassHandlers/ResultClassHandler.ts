import { AnnotatedHearingOutcome, Offence, Result } from "../../../../../types/AnnotatedHearingOutcome"
import ExceptionsAndOperations from "../ExceptionsAndOperations"

export type ResultClassHandlerParams = {
  aho: AnnotatedHearingOutcome
  offence: Offence
  offenceIndex: number
  result: Result
  resultIndex: number
  resubmitted: boolean
  allResultsAlreadyOnPnc: boolean
}

export type ResultClassHandler = (params: ResultClassHandlerParams) => ExceptionsAndOperations
