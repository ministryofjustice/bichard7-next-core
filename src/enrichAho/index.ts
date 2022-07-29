import type { AnnotatedHearingOutcome } from "../types/AnnotatedHearingOutcome"
import type { EnrichAhoFunction } from "../types/EnrichAhoFunction"
import type PncGateway from "../types/PncGateway"
import {
  enrichCase,
  enrichCourt,
  enrichDefendant,
  enrichForceOwner,
  enrichOffenceResults,
  enrichOffenceResultsPostPncEnrichment,
  enrichOffences,
  enrichWithPncQuery
} from "./enrichFunctions"

const enrichAho = (hearingOutcome: AnnotatedHearingOutcome, pncGateway: PncGateway): AnnotatedHearingOutcome => {
  const pncEnrich: EnrichAhoFunction = (aho) => enrichWithPncQuery(aho, pncGateway)

  const enrichSteps: EnrichAhoFunction[] = [
    enrichCourt,
    enrichDefendant,
    enrichOffences,
    enrichOffenceResults,
    enrichCase,
    pncEnrich,
    enrichOffenceResultsPostPncEnrichment,
    enrichForceOwner
  ]

  return enrichSteps.reduce((aho, fn) => fn(aho), hearingOutcome)
}

export default enrichAho
