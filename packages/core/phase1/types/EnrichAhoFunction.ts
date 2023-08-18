import type { AnnotatedHearingOutcome } from "core/common/types/AnnotatedHearingOutcome"

export type EnrichAhoFunction = (hearingOutcome: AnnotatedHearingOutcome) => AnnotatedHearingOutcome
