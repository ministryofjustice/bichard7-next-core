import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import type Exception from "@moj-bichard7/common/types/Exception"

export type ExceptionGenerator = (
  hearingOutcome: AnnotatedHearingOutcome,
  options?: {
    exceptions?: Exception[]
  }
) => Exception[]
