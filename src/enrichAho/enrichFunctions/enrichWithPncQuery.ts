import type AuditLogger from "src/types/AuditLogger"
import type EventCategory from "src/types/EventCategory"
import { lookupOffenceByCjsCode } from "../../dataLookup"
import enrichCourtCases from "../../enrichAho/enrichFunctions/enrichCourtCases"
import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type PncGateway from "../../types/PncGateway"
import type { PncCourtCase, PncOffence, PncPenaltyCase } from "../../types/PncQueryResult"

const addTitle = (offence: PncOffence): void => {
  offence.offence.title = lookupOffenceByCjsCode(offence.offence.cjsOffenceCode)?.offenceTitle ?? "Unknown Offence"
}

const addTitleToCaseOffences = (cases: PncPenaltyCase[] | PncCourtCase[] | undefined) =>
  cases && cases.forEach((c) => c.offences.forEach(addTitle))

const clearPNCPopulatedElements = (aho: AnnotatedHearingOutcome): void => {
  const hoCase = aho.AnnotatedHearingOutcome.HearingOutcome.Case
  hoCase.CourtCaseReferenceNumber = undefined
  hoCase.PenaltyNoticeCaseReferenceNumber = undefined

  const hoDefendant = hoCase.HearingDefendant
  hoDefendant.PNCCheckname = undefined
  hoDefendant.CRONumber = undefined
  hoDefendant.PNCIdentifier = undefined

  hoDefendant.Offence.forEach((offence) => {
    offence.AddedByTheCourt = undefined
    if (offence.CourtCaseReferenceNumber && !offence.ManualCourtCaseReference) {
      offence.CourtCaseReferenceNumber = undefined
    }
    if (offence.ManualSequenceNumber === undefined) {
      offence.CriminalProsecutionReference.OffenceReasonSequence = undefined
    }
    offence.Result.forEach((result) => (result.PNCAdjudicationExists = undefined))
  })
}

const createAuditLogEvent = (eventType: string, category: EventCategory) => {
  return {
    timestamp: new Date(),
    eventType: eventType,
    eventSource: "EnrichWithPncQuery",
    category: category
  }
}

export default (
  annotatedHearingOutcome: AnnotatedHearingOutcome,
  pncGateway: PncGateway,
  auditLogger: AuditLogger
): AnnotatedHearingOutcome => {
  clearPNCPopulatedElements(annotatedHearingOutcome)
  const pncResult = pncGateway.query(
    annotatedHearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber
  )

  if (pncResult instanceof Error) {
    auditLogger.logEvent(createAuditLogEvent("PNC Response not received", "warning"))

    annotatedHearingOutcome.PncErrorMessage = pncResult.message
  } else {
    auditLogger.logEvent(createAuditLogEvent("PNC Response received", "information"))

    annotatedHearingOutcome.PncQuery = pncResult
  }
  annotatedHearingOutcome.PncQueryDate = pncGateway.queryTime

  addTitleToCaseOffences(annotatedHearingOutcome.PncQuery?.courtCases)
  addTitleToCaseOffences(annotatedHearingOutcome.PncQuery?.penaltyCases)

  if (annotatedHearingOutcome.PncQuery !== undefined) {
    annotatedHearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.RecordableOnPNCindicator = true
  }

  annotatedHearingOutcome = enrichCourtCases(annotatedHearingOutcome)

  return annotatedHearingOutcome
}
