import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type Exception from "../types/Exception"

export type ExceptionGenerator = (
  hearingOutcome: AnnotatedHearingOutcome,
  options?: {
    exceptions?: Exception[]
  }
) => Exception[]
