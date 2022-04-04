import type { AnnotatedHearingOutcome } from "./AnnotatedHearingOutcome"
import type Exception from "./Exception"

export type ExceptionGenerator = (
  hearingOutcome: AnnotatedHearingOutcome,
  options?: {
    exceptions?: Exception[]
  }
) => Exception[]
