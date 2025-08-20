import type { Result } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import nonRecordableResultCodes from "@moj-bichard7/common/aho/offences/nonRecordableResultCodes"

const isRecordableResult = (result: Result): boolean =>
  !!result.PNCDisposalType && !nonRecordableResultCodes.includes(result.PNCDisposalType)

export default isRecordableResult
