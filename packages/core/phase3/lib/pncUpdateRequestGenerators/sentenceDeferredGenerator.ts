import { PncOperation } from "../../../types/PncOperation"
import type PncUpdateRequestGenerator from "../../types/PncUpdateRequestGenerator"
import formatDateSpecifiedInResult from "../../../phase2/lib/createPncDisposalsFromResult/formatDateSpecifiedInResult"
import preProcessPncIdentifier from "../preProcessPncIdentifier"
import { generateHearingsAndDisposals } from "./hearingDetails"
import { isError } from "@moj-bichard7/common/types/Result"
import { preProcessCourtCaseReferenceNumber } from "./normalDisposalGenerator"
import getForceStationCode from "../getForceStationCode"
import getPncCourtCode from "../getPncCourtCode"

const SENTENCE_DEFERRED_HEARING_TYPE = "D"

const sentenceDeferredGenerator: PncUpdateRequestGenerator<PncOperation.SENTENCE_DEFERRED> = (
  pncUpdateDataset,
  operation
) => {
  const hearing = pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Hearing
  const hearingDefendant = pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant
  const pncCheckName = hearingDefendant.PNCCheckname?.split("/")[0].substring(0, 12) ?? null

  const courtCaseReference =
    operation.data?.courtCaseReference ??
    pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.CourtCaseReferenceNumber
  const formattedCourtCaseReference = preProcessCourtCaseReferenceNumber(courtCaseReference)
  if (isError(formattedCourtCaseReference)) {
    return formattedCourtCaseReference
  }

  const courtCode = getPncCourtCode(hearing.CourtHearingLocation, hearing.CourtHouseCode)
  if (isError(courtCode)) {
    return courtCode
  }

  return {
    operation: PncOperation.SENTENCE_DEFERRED,
    request: {
      courtCaseReferenceNumber: formattedCourtCaseReference,
      courtCode,
      croNumber: hearingDefendant.CRONumber ?? null,
      forceStationCode: getForceStationCode(pncUpdateDataset, true),
      hearingDate: formatDateSpecifiedInResult(hearing.DateOfHearing, true),
      hearingDetails: generateHearingsAndDisposals(pncUpdateDataset, courtCaseReference),
      hearingType: SENTENCE_DEFERRED_HEARING_TYPE,
      pncCheckName,
      pncIdentifier: preProcessPncIdentifier(hearingDefendant.PNCIdentifier)
    }
  }
}

export default sentenceDeferredGenerator
