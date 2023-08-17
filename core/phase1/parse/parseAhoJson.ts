import { dateReviver } from "common/axiosDateTransformer"
import type { AnnotatedHearingOutcome } from "core/phase1/types/AnnotatedHearingOutcome"

const parseAhoJson = (aho: unknown): AnnotatedHearingOutcome => {
  return JSON.parse(JSON.stringify(aho), dateReviver) as AnnotatedHearingOutcome
}

export default parseAhoJson
