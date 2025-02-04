import type { Result } from "../types/AnnotatedHearingOutcome"

import nonRecordableResultCodes from "./nonRecordableResultCodes"

const isRecordableResult = (result: Result): boolean =>
  !!result.PNCDisposalType && !nonRecordableResultCodes.includes(result.PNCDisposalType)

export default isRecordableResult
