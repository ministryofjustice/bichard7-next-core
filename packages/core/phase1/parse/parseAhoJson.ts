import { dateReviver } from "@moj-bichard7/common/axiosDateTransformer"
import type { AnnotatedHearingOutcome } from "types/AnnotatedHearingOutcome"

const parseAhoJson = (aho: unknown): AnnotatedHearingOutcome => {
  return JSON.parse(JSON.stringify(aho), dateReviver) as AnnotatedHearingOutcome
}

export default parseAhoJson
