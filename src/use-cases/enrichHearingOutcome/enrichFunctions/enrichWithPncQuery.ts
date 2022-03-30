import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"
import type PncGateway from "src/types/PncGateway"
import type { PncOffence } from "src/types/PncQueryResult"
import { lookupOffenceByCjsCode } from "src/use-cases/dataLookup"

const addTitle = (offence: PncOffence): PncOffence => {
  offence.offence.title = lookupOffenceByCjsCode(offence.offence.cjsOffenceCode)?.offenceTitle
  return offence
}

export default (annotatedHearingOutcome: AnnotatedHearingOutcome, pncGateway: PncGateway): AnnotatedHearingOutcome => {
  annotatedHearingOutcome.PncQueryDate = new Date()

  annotatedHearingOutcome.PncQuery = pncGateway.query(
    annotatedHearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber
  )

  annotatedHearingOutcome.PncQuery?.cases?.forEach((pncCase) => {
    pncCase.offences = pncCase.offences.map(addTitle)
  })

  return annotatedHearingOutcome
}
