import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"
import type { EnrichAhoFunction } from "src/types/EnrichAhoFunction"
import type PncGateway from "src/types/PncGateway"
import { enrichCourt, enrichDefendant, enrichOffenceResults, enrichWithPncQuery } from "./enrichFunctions"

const enrichHearingOutcome = (
  hearingOutcome: AnnotatedHearingOutcome,
  pncGateway: PncGateway
): AnnotatedHearingOutcome => {
  const pncEnrich: EnrichAhoFunction = (aho) => enrichWithPncQuery(aho, pncGateway)

  const enrichSteps: EnrichAhoFunction[] = [enrichCourt, enrichDefendant, enrichOffenceResults, pncEnrich]

  return enrichSteps.reduce((aho, fn) => fn(aho), hearingOutcome)
}

export default enrichHearingOutcome
