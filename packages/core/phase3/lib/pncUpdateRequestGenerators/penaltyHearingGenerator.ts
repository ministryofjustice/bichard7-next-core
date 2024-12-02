import { PncOperation } from "../../../types/PncOperation"
import type PncUpdateRequestGenerator from "../../types/PncUpdateRequestGenerator"
import { isError } from "@moj-bichard7/common/types/Result"
import getPncCourtCode from "../getPncCourtCode"
import getForceStationCode from "../getForceStationCode"
import formatDateSpecifiedInResult from "../../../phase2/lib/createPncDisposalsFromResult/formatDateSpecifiedInResult"
import { generateHearingsAdjudicationsAndDisposals } from "./hearingDetails"
import preProcessPncIdentifier from "../preProcessPncIdentifier"

const PENALTY_HEARING_TYPE = "P"

const penaltyHearingGenerator: PncUpdateRequestGenerator<PncOperation.PENALTY_HEARING> = (
  pncUpdateDataset,
  operation
) => {
  const hearing = pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Hearing
  const hearingDefendant = pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant
  const pncCheckName = hearingDefendant.PNCCheckname?.split("/")[0].substring(0, 12) ?? null

  const penaltyNoticeCaseRef =
    operation.data?.courtCaseReference ??
    pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.PenaltyNoticeCaseReferenceNumber

  if (!penaltyNoticeCaseRef) {
    return new Error("Penalty notice case ref is missing")
  }

  const courtCode = getPncCourtCode(hearing.CourtHearingLocation, hearing.CourtHouseCode)
  if (isError(courtCode)) {
    return courtCode
  }

  return {
    operation: PncOperation.PENALTY_HEARING,
    request: {
      courtCode,
      croNumber: hearingDefendant.CRONumber ?? null,
      forceStationCode: getForceStationCode(pncUpdateDataset, true),
      hearingDate: formatDateSpecifiedInResult(hearing.DateOfHearing, true),
      hearingDetails: generateHearingsAdjudicationsAndDisposals(pncUpdateDataset, penaltyNoticeCaseRef),
      hearingType: PENALTY_HEARING_TYPE,
      penaltyNoticeCaseRef: penaltyNoticeCaseRef,
      pncCheckName,
      pncIdentifier: preProcessPncIdentifier(hearingDefendant.PNCIdentifier)
    }
  }
}

export default penaltyHearingGenerator
