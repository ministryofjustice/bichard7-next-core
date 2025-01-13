import EventCode from "@moj-bichard7/common/types/EventCode"
import { isError } from "@moj-bichard7/common/types/Result"

import type { AnnotatedHearingOutcome } from "../../../types/AnnotatedHearingOutcome"
import type AuditLogger from "../../../types/AuditLogger"
import type PncGatewayInterface from "../../../types/PncGatewayInterface"
import type { PncCourtCase, PncOffence, PncPenaltyCase } from "../../../types/PncQueryResult"

import { lookupOffenceByCjsCode } from "../../../lib/dataLookup"
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
  aho: AnnotatedHearingOutcome,
  pncGateway: PncGatewayInterface,
  auditLogger: AuditLogger,
  isIgnored: boolean
): Promise<AnnotatedHearingOutcome> => {
  clearPNCPopulatedElements(aho)
  const asn = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber
  const correlationId = aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID
  const offenceCount = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.length
  // TODO: Bichard currently only checks the format, but we should use 'isAsnValid' here instead
  if (isDummyAsn(asn) || !isAsnFormatValid(asn) || offenceCount > 100) {
    return aho
  }

  const requestStartTime = new Date()

  const pncResult = await pncGateway.query(asn, correlationId)

  const auditLogAttributes = {
    "PNC Response Time": new Date().getTime() - requestStartTime.getTime(),
    "PNC Attempts Made": 1, // Retry is not implemented
    "PNC Request Type": "enquiry",
    "PNC Request Message": aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber,
    "PNC Response Message": isError(pncResult) ? pncResult.messages.join(", ") : pncResult,
    sensitiveAttributes: "PNC Request Message,PNC Response Message"
  }

  auditLogger.info(EventCode.PncResponseReceived, auditLogAttributes)
  if (isError(pncResult)) {
    for (const message of pncResult.messages) {
      if (!isIgnored && (!isNotFoundError(message) || isCaseRecordable(aho))) {
        aho.Exceptions.push(generatePncEnquiryExceptionFromMessage(message))
      }
    }
  } else {
    aho.PncQuery = pncResult
  }

  aho.PncQueryDate = pncGateway.queryTime

  addTitleToCaseOffences(aho.PncQuery?.courtCases)
  addTitleToCaseOffences(aho.PncQuery?.penaltyCases)

  if (aho.PncQuery !== undefined) {
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.RecordableOnPNCindicator = true
  }

  aho = matchOffencesToPnc(aho)

  const { PNCIdentifier, CourtPNCIdentifier } = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant
  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.PNCIdentifier =
    aho.PncQuery?.pncId ?? PNCIdentifier ?? CourtPNCIdentifier
  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.PNCCheckname = aho.PncQuery?.checkName

  return aho
}
