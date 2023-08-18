import type { AnnotatedHearingOutcome } from "types/AnnotatedHearingOutcome"

export type EnrichAhoFunction = (hearingOutcome: AnnotatedHearingOutcome) => AnnotatedHearingOutcome
