import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"
import type PncGateway from "src/types/PncGateway"
import type { PncCourtCase, PncOffence, PncPenaltyCase } from "src/types/PncQueryResult"
import { lookupOffenceByCjsCode } from "src/use-cases/dataLookup"
import enrichCourtCases from "src/use-cases/enrichHearingOutcome/enrichFunctions/enrichCourtCases"

const addTitle = (offence: PncOffence): PncOffence => {
  offence.offence.title = lookupOffenceByCjsCode(offence.offence.cjsOffenceCode)?.offenceTitle
  return offence
}

const addTitleToCaseOffences = (cases: PncPenaltyCase[] | PncCourtCase[] | undefined) =>
  cases && cases.forEach((c) => c.offences.forEach(addTitle))

export default (annotatedHearingOutcome: AnnotatedHearingOutcome, pncGateway: PncGateway): AnnotatedHearingOutcome => {
  annotatedHearingOutcome.PncQueryDate = pncGateway.queryTime

  // TODO: We need to handle errors from the PNC here and create exceptions
  annotatedHearingOutcome.PncQuery = pncGateway.query(
    annotatedHearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber
  )

  addTitleToCaseOffences(annotatedHearingOutcome.PncQuery?.courtCases)
  addTitleToCaseOffences(annotatedHearingOutcome.PncQuery?.penaltyCases)

  annotatedHearingOutcome = enrichCourtCases(annotatedHearingOutcome)

  return annotatedHearingOutcome
}
