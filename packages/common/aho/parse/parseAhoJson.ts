import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"

import { dateReviver } from "../../axiosDateTransformer"

const parseAhoJson = (aho: unknown): AnnotatedHearingOutcome => {
  return JSON.parse(JSON.stringify(aho), dateReviver) as AnnotatedHearingOutcome
}

export default parseAhoJson
