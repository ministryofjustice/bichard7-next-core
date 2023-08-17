import type { AnnotatedHearingOutcome } from "./AnnotatedHearingOutcome"

export type EnrichAhoFunction = (hearingOutcome: AnnotatedHearingOutcome) => AnnotatedHearingOutcome
