import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type PncGatewayInterface from "../../types/PncGatewayInterface"
import type AuditLogger from "../types/AuditLogger"
import type { EnrichAhoFunction } from "../types/EnrichAhoFunction"
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
