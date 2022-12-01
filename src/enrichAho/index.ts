import type AuditLogger from "src/types/AuditLogger"
import type { AnnotatedHearingOutcome } from "../types/AnnotatedHearingOutcome"
import type { EnrichAhoFunction } from "../types/EnrichAhoFunction"
import type PncGatewayInterface from "../types/PncGatewayInterface"
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

const enrichAho = (
  hearingOutcome: AnnotatedHearingOutcome,
  pncGateway: PncGatewayInterface,
  auditLogger: AuditLogger
): AnnotatedHearingOutcome => {
  const pncEnrich: EnrichAhoFunction = (aho) => enrichWithPncQuery(aho, pncGateway, auditLogger)

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
