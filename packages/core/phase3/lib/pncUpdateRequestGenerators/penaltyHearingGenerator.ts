import type PncUpdateRequestGenerator from "../../types/PncUpdateRequestGenerator"

import formatDateSpecifiedInResult from "../../../lib/results/createPncDisposalsFromResult/formatDateSpecifiedInResult"
import { PncOperation } from "../../../types/PncOperation"
import generateBasePncUpdateRequest from "../generateBasePncUpdateRequest"
import getPncCourtCode from "../getPncCourtCode"
import { generateHearingsAdjudicationsAndDisposals } from "../hearingDetails/generateHearingsAdjudicationsAndDisposals"

const PENALTY_HEARING_TYPE = "P"

const penaltyHearingGenerator: PncUpdateRequestGenerator<PncOperation.PENALTY_HEARING> = (
  pncUpdateDataset,
  operation
) => {
  const hearing = pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Hearing

  const penaltyNoticeCaseRef =
    operation.data?.courtCaseReference ??
    pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.PenaltyNoticeCaseReferenceNumber

  if (!penaltyNoticeCaseRef) {
    // We generate penalty hearing operation only if PenaltyNoticeCaseReferenceNumber has value in Phase 2.
    // If we get this error something is very wrong.
    return new Error("Penalty notice case ref is missing")
  }

  return {
    operation: PncOperation.PENALTY_HEARING,
    request: {
      ...generateBasePncUpdateRequest(pncUpdateDataset),
      courtCode: getPncCourtCode(hearing.CourtHearingLocation, hearing.CourtHouseCode),
      hearingDate: formatDateSpecifiedInResult(hearing.DateOfHearing, true),
      hearingDetails: generateHearingsAdjudicationsAndDisposals(pncUpdateDataset, penaltyNoticeCaseRef),
      hearingType: PENALTY_HEARING_TYPE,
      penaltyNoticeCaseRef
    }
  }
}

export default penaltyHearingGenerator
