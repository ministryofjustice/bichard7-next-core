import type { Result } from "../../types/AnnotatedHearingOutcome"
import nonRecordableResults from "../../lib/nonRecordableResults"

const isRecordableResult = (result: Result): boolean =>
  !!result.PNCDisposalType && !nonRecordableResults.includes(result.PNCDisposalType)

export default isRecordableResult
