import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import type { PncCourtCase, PncOffence, PncPenaltyCase } from "@moj-bichard7/common/types/PncQueryResult"

import { lookupOffenceByCjsCode } from "@moj-bichard7/common/aho/dataLookup/index"
import EventCode from "@moj-bichard7/common/types/EventCode"
import { isError } from "@moj-bichard7/common/types/Result"

import type AuditLogger from "../../../types/AuditLogger"
import type PoliceGateway from "../../../types/PoliceGateway"

import isCaseRecordable from "../../../lib/isCaseRecordable"
import isDummyAsn from "../../../lib/isDummyAsn"
import generatePncEnquiryExceptionFromMessage, {
  isNotFoundError
} from "../../exceptions/generatePncEnquiryExceptionFromMessage"
import { isAsnFormatValid } from "../../lib/isAsnValid"
import matchOffencesToPnc from "./matchOffencesToPnc"

const addTitle = (offence: PncOffence): void => {
  offence.offence.title = lookupOffenceByCjsCode(offence.offence.cjsOffenceCode)?.offenceTitle ?? "Unknown Offence"
}

const addTitleToCaseOffences = (cases: PncCourtCase[] | PncPenaltyCase[] | undefined) =>
  cases && cases.forEach((c) => c.offences.forEach(addTitle))

const clearPNCPopulatedElements = (aho: AnnotatedHearingOutcome): void => {
  const hoCase = aho.AnnotatedHearingOutcome.HearingOutcome.Case
  hoCase.CourtCaseReferenceNumber = undefined
  hoCase.PenaltyNoticeCaseReferenceNumber = undefined

  const hoDefendant = hoCase.HearingDefendant
  hoDefendant.PNCCheckname = undefined
  hoDefendant.CRONumber = undefined

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
  policeGateway: PoliceGateway,
  auditLogger: AuditLogger,
  isIgnored: boolean
): Promise<AnnotatedHearingOutcome> => {
  clearPNCPopulatedElements(annotatedHearingOutcome)
  const asn = annotatedHearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber
  const correlationId = annotatedHearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID
  const offenceCount =
    annotatedHearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.length
  // TODO: Bichard currently only checks the format, but we should use 'isAsnValid' here instead
  if (isDummyAsn(asn) || !isAsnFormatValid(asn) || offenceCount > 100) {
    return annotatedHearingOutcome
  }

  const requestStartTime = new Date()

  const pncResult = await policeGateway.query(asn, correlationId)

  const auditLogAttributes = {
    "PNC Response Time": new Date().getTime() - requestStartTime.getTime(),
    "PNC Attempts Made": 1, // Retry is not implemented
    "PNC Request Type": "enquiry",
    "PNC Request Message":
      annotatedHearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber,
    "PNC Response Message": isError(pncResult) ? pncResult.messages.join(", ") : pncResult,
    sensitiveAttributes: "PNC Request Message,PNC Response Message"
  }

  auditLogger.info(EventCode.PncResponseReceived, auditLogAttributes)
  if (isError(pncResult)) {
    for (const message of pncResult.messages) {
      if (!isIgnored && (!isNotFoundError(message) || isCaseRecordable(annotatedHearingOutcome))) {
        annotatedHearingOutcome.Exceptions.push(generatePncEnquiryExceptionFromMessage(message))
      }
    }
  } else {
    annotatedHearingOutcome.PncQuery = pncResult
  }

  annotatedHearingOutcome.PncQueryDate = policeGateway.queryTime

  addTitleToCaseOffences(annotatedHearingOutcome.PncQuery?.courtCases)
  addTitleToCaseOffences(annotatedHearingOutcome.PncQuery?.penaltyCases)

  if (annotatedHearingOutcome.PncQuery !== undefined) {
    const { pncId, checkName } = annotatedHearingOutcome.PncQuery
    annotatedHearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.PNCIdentifier = pncId
    annotatedHearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.PNCCheckname = checkName
    annotatedHearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.RecordableOnPNCindicator = true
  }

  annotatedHearingOutcome = matchOffencesToPnc(annotatedHearingOutcome)

  return annotatedHearingOutcome
}
