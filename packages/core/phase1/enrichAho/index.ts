import {
  enrichCase,
  enrichCourt,
  enrichDefendant,
  enrichForceOwner,
  enrichOffenceResults,
  enrichOffenceResultsPostPncEnrichment,
  enrichOffences,
  enrichWithPncQuery
} from "phase1/enrichAho/enrichFunctions"
import type AuditLogger from "phase1/types/AuditLogger"
import type { EnrichAhoFunction } from "phase1/types/EnrichAhoFunction"
import type { AnnotatedHearingOutcome } from "types/AnnotatedHearingOutcome"
import type PncGatewayInterface from "types/PncGatewayInterface"

const enrichAho = async (
  hearingOutcome: AnnotatedHearingOutcome,
  pncGateway: PncGatewayInterface,
  auditLogger: AuditLogger
): Promise<AnnotatedHearingOutcome> => {
  const enrichSteps: EnrichAhoFunction[] = [
    enrichCourt,
    enrichDefendant,
    enrichOffences,
    enrichOffenceResults,
    enrichCase
  ]

  enrichSteps.reduce((aho, fn) => fn(aho), hearingOutcome)

  await enrichWithPncQuery(hearingOutcome, pncGateway, auditLogger)
  enrichOffenceResultsPostPncEnrichment(hearingOutcome)
  enrichForceOwner(hearingOutcome)

  return hearingOutcome
}

export default enrichAho
