import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import type AuditLogger from "../../types/AuditLogger"
import type PoliceGateway from "../../types/PoliceGateway"
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
  policeGateway: PoliceGateway,
  auditLogger: AuditLogger,
  isIgnored: boolean
): Promise<AnnotatedHearingOutcome> => {
  const enrichSteps: EnrichAhoFunction[] = [
    enrichCourt,
    enrichDefendant,
    enrichOffences,
    enrichOffenceResults,
    enrichCase
  ]

  enrichSteps.reduce((aho, fn) => fn(aho), hearingOutcome)

  await enrichWithPncQuery(hearingOutcome, policeGateway, auditLogger, isIgnored)
  enrichOffenceResultsPostPncEnrichment(hearingOutcome)
  enrichForceOwner(hearingOutcome)

  return hearingOutcome
}

export default enrichAho
