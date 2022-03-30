import type { AnnotatedHearingOutcome } from "./AnnotatedHearingOutcome"
import type Exception from "./Exception"

export type ExceptionGenerator = (hearingOutcome: AnnotatedHearingOutcome) => Exception[]
