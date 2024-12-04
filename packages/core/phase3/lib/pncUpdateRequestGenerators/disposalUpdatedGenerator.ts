import { PncOperation } from "../../../types/PncOperation"
import type PncUpdateRequestGenerator from "../../types/PncUpdateRequestGenerator"
import { preProcessCourtCaseReferenceNumber } from "./normalDisposalGenerator"
import { isError } from "@moj-bichard7/common/types/Result"
import getPncCourtCode from "../getPncCourtCode"
import getForceStationCode from "../getForceStationCode"
import formatDateSpecifiedInResult from "../../../phase2/lib/createPncDisposalsFromResult/formatDateSpecifiedInResult"
import { generateHearingsAdjudicationsAndDisposals } from "./hearingDetails"
import preProcessPncIdentifier from "../preProcessPncIdentifier"

const DISPOSAL_UPDATED_HEARING_TYPE = "V"

const disposalUpdatedGenerator: PncUpdateRequestGenerator<PncOperation.DISPOSAL_UPDATED> = (
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
    operation: PncOperation.DISPOSAL_UPDATED,
    request: {
      courtCaseReferenceNumber: formattedCourtCaseReference,
      courtCode,
      croNumber: hearingDefendant.CRONumber ?? null,
      forceStationCode: getForceStationCode(pncUpdateDataset, true),
      hearingDate: formatDateSpecifiedInResult(hearing.DateOfHearing, true),
      hearingDetails: generateHearingsAdjudicationsAndDisposals(pncUpdateDataset, courtCaseReference),
      hearingType: DISPOSAL_UPDATED_HEARING_TYPE,
      pncCheckName,
      pncIdentifier: preProcessPncIdentifier(hearingDefendant.PNCIdentifier)
    }
  }
}

export default disposalUpdatedGenerator
