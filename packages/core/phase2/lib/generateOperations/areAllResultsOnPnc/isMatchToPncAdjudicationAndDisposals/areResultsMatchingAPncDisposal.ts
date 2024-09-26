import type { Offence } from "../../../../../types/AnnotatedHearingOutcome"
import type { PncDisposal } from "../../../../../types/PncQueryResult"
import isRecordableResult from "../../../isRecordableResult"
import isMatchToPncDisposal from "./isMatchToPncDisposal"

const areResultsMatchingAPncDisposal = (offence: Offence, disposals: PncDisposal[]): boolean =>
  offence.Result.every((result) => !isRecordableResult(result) || isMatchToPncDisposal(disposals, result))

export default areResultsMatchingAPncDisposal
