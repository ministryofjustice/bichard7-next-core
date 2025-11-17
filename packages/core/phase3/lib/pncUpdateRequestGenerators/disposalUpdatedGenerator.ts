import { PncOperation } from "@moj-bichard7/common/types/PncOperation"
import { isError } from "@moj-bichard7/common/types/Result"

import type PncUpdateRequestGenerator from "../../types/PncUpdateRequestGenerator"

import formatDateSpecifiedInResult from "../../../lib/results/createPoliceDisposalsFromResult/formatDateSpecifiedInResult"
import generateBasePncUpdateRequest from "../generateBasePncUpdateRequest"
import getPncCourtCode from "../getPncCourtCode"
import { generateHearingsAdjudicationsAndDisposals } from "../hearingDetails/generateHearingsAdjudicationsAndDisposals"
import preProcessCourtCaseReferenceNumber from "../preProcessCourtCaseReferenceNumber"

const DISPOSAL_UPDATED_HEARING_TYPE = "V"

const disposalUpdatedGenerator: PncUpdateRequestGenerator<PncOperation.DISPOSAL_UPDATED> = (
  pncUpdateDataset,
  operation
) => {
  const hearing = pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Hearing

  const courtCaseReference =
    operation.data?.courtCaseReference ??
    pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.CourtCaseReferenceNumber
  const formattedCourtCaseReference = preProcessCourtCaseReferenceNumber(courtCaseReference)
  if (isError(formattedCourtCaseReference)) {
    return formattedCourtCaseReference
  }

  return {
    operation: PncOperation.DISPOSAL_UPDATED,
    request: {
      ...generateBasePncUpdateRequest(pncUpdateDataset),
      courtCaseReferenceNumber: formattedCourtCaseReference,
      courtCode: getPncCourtCode(hearing.CourtHearingLocation, hearing.CourtHouseCode),
      hearingDate: formatDateSpecifiedInResult(hearing.DateOfHearing, true),
      hearingDetails: generateHearingsAdjudicationsAndDisposals(pncUpdateDataset, courtCaseReference),
      hearingType: DISPOSAL_UPDATED_HEARING_TYPE
    }
  }
}

export default disposalUpdatedGenerator
