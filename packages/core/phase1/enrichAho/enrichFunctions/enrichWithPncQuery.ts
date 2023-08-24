import { AuditLogEventOptions, AuditLogEventSource } from "@moj-bichard7/common/types/AuditLogEvent"
import EventCategory from "@moj-bichard7/common/types/EventCategory"
import { isError } from "@moj-bichard7/common/types/Result"
import type { AnnotatedHearingOutcome } from "../../../types/AnnotatedHearingOutcome"
import type PncGatewayInterface from "../../../types/PncGatewayInterface"
import type { PncCourtCase, PncOffence, PncPenaltyCase } from "../../../types/PncQueryResult"
import { lookupOffenceByCjsCode } from "../../dataLookup"
import getAuditLogEvent from "../../lib/auditLog/getAuditLogEvent"
import { isAsnFormatValid } from "../../lib/isAsnValid"
import isDummyAsn from "../../lib/isDummyAsn"
import type AuditLogger from "../../types/AuditLogger"
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
    if (offence.CourtCaseReferenceNumber !== undefined && !offence.ManualCourtCaseReference) {
      offence.CourtCaseReferenceNumber = undefined
    }
    if (!offence.ManualSequenceNumber || !offence.CriminalProsecutionReference.OffenceReasonSequence) {
      offence.ManualSequenceNumber = undefined
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
        AuditLogEventOptions.pncResponseNotReceived,
        EventCategory.warning,
        AuditLogEventSource.EnrichWithPncQuery,
        auditLogAttributes
      )
    )
    annotatedHearingOutcome.PncErrorMessage = pncResult.message
  } else {
    auditLogger.logEvent(
      getAuditLogEvent(
        AuditLogEventOptions.pncResponseReceived,
        EventCategory.information,
        AuditLogEventSource.EnrichWithPncQuery,
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

  annotatedHearingOutcome = matchOffencesToPnc(annotatedHearingOutcome)

  return annotatedHearingOutcome
}
