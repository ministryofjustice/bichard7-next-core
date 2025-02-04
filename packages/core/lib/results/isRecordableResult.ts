import type { Result } from "../../types/AnnotatedHearingOutcome"

import nonRecordableResultCodes from "../offences/nonRecordableResultCodes"

const isRecordableResult = (result: Result): boolean =>
  !!result.PNCDisposalType && !nonRecordableResultCodes.includes(result.PNCDisposalType)

export default isRecordableResult
