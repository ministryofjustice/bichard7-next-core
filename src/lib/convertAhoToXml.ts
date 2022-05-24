import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"

export default (hearingOutcome: AnnotatedHearingOutcome): string => {
  // TODO: Convert aho to xml without namespaces (for now)
  return "hearingOutcome"
}
