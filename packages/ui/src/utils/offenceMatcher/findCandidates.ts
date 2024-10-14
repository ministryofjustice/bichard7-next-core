import { CaseType } from "@moj-bichard7-developers/bichard7-next-core/core/phase1/enrichAho/enrichFunctions/matchOffencesToPnc/annotatePncMatch"
import generateCandidate from "@moj-bichard7-developers/bichard7-next-core/core/phase1/enrichAho/enrichFunctions/matchOffencesToPnc/generateCandidate"
import type { DisplayFullCourtCase } from "../../types/display/CourtCases"
import type { Candidates } from "../../types/OffenceMatching"

const findCandidates = (courtCase: DisplayFullCourtCase, offenceIndex: number): Candidates[] => {
  if (!courtCase.aho.PncQuery || !courtCase.aho.PncQuery.courtCases) {
    return []
  }

  const offence = courtCase.aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex]
  const candidates = courtCase.aho.PncQuery.courtCases
    .map((c) => {
      const matchForThisCase = c.offences.filter(
        (pncOffence) =>
          !!generateCandidate(
            offence,
            { pncOffence, caseType: CaseType.court, caseReference: c.courtCaseReference },
            courtCase.aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.DateOfHearing
          )
      )
      if (matchForThisCase.length > 0) {
        return {
          courtCaseReference: c.courtCaseReference,
          offences: matchForThisCase
        }
      }
    })
    .filter((e) => !!e)

  return candidates as Candidates[]
}

export default findCandidates
