import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

export type EnrichAhoFunction = (hearingOutcome: AnnotatedHearingOutcome) => AnnotatedHearingOutcome
