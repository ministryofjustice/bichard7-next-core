import { isError } from "src/comparison/types"
import getAuditLogEvent from "src/lib/auditLog/getAuditLogEvent"
import { isAsnFormatValid } from "src/lib/isAsnValid"
import isDummyAsn from "src/lib/isDummyAsn"
import type AuditLogger from "src/types/AuditLogger"
import { lookupOffenceByCjsCode } from "../../dataLookup"
import enrichCourtCases from "../../enrichAho/enrichFunctions/enrichCourtCases"
import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type PncGatewayInterface from "../../types/PncGatewayInterface"
import type { PncCourtCase, PncOffence, PncPenaltyCase } from "../../types/PncQueryResult"
import { matchOffencesToPnc } from "./matchOffencesToPnc"

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

export default async (
  annotatedHearingOutcome: AnnotatedHearingOutcome,
  pncGateway: PncGatewayInterface,
  auditLogger: AuditLogger
): Promise<AnnotatedHearingOutcome> => {
  clearPNCPopulatedElements(annotatedHearingOutcome)
  const asn = annotatedHearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber
  const offenceCount =
    annotatedHearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.length
  // TODO: Bichard currently only checks the format, but we should use 'isAsnValid' here instead
  if (isDummyAsn(asn) || !isAsnFormatValid(asn) || offenceCount > 100) {
    return annotatedHearingOutcome
  }

  const requestStartTime = new Date()

  const pncResult = await pncGateway.query(asn)

  const auditLogAttributes = {
    "PNC Response Time": new Date().getTime() - requestStartTime.getTime(),
    "PNC Attempts Made": 1, // Retry is not implemented
    "PNC Request Type": "enquiry",
    "PNC Request Message":
      annotatedHearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber,
    "PNC Response Message": isError(pncResult) ? pncResult.message : pncResult,
    sensitiveAttributes: "PNC Request Message,PNC Response Message"
  }

  if (isError(pncResult)) {
    auditLogger.logEvent(
      getAuditLogEvent(
        "pnc.response-not-received",
        "warning",
        "PNC Response not received",
        "EnrichWithPncQuery",
        auditLogAttributes
      )
    )
    annotatedHearingOutcome.PncErrorMessage = pncResult.message
  } else {
    auditLogger.logEvent(
      getAuditLogEvent(
        "pnc.response-received",
        "information",
        "PNC Response received",
        "EnrichWithPncQuery",
        auditLogAttributes
      )
    )

    annotatedHearingOutcome.PncQuery = pncResult
  }
  annotatedHearingOutcome.PncQueryDate = pncGateway.queryTime

  addTitleToCaseOffences(annotatedHearingOutcome.PncQuery?.courtCases)
  addTitleToCaseOffences(annotatedHearingOutcome.PncQuery?.penaltyCases)

  if (annotatedHearingOutcome.PncQuery !== undefined) {
    annotatedHearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.RecordableOnPNCindicator = true
  }

  if (process.env.USE_NEW_MATCHER !== "false") {
    annotatedHearingOutcome = matchOffencesToPnc(annotatedHearingOutcome)
  } else {
    annotatedHearingOutcome = enrichCourtCases(annotatedHearingOutcome)
  }

  return annotatedHearingOutcome
}
