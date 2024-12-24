import { isError } from "@moj-bichard7/common/types/Result"

import type PncUpdateRequestGenerator from "../../types/PncUpdateRequestGenerator"

import formatDateSpecifiedInResult from "../../../lib/createPncDisposalsFromResult/formatDateSpecifiedInResult"
import { PncOperation } from "../../../types/PncOperation"
import generateBasePncUpdateRequest from "../generateBasePncUpdateRequest"
import getPncCourtCode from "../getPncCourtCode"
import { generateHearingsAdjudicationsAndDisposals } from "../hearingDetails/generateHearingsAdjudicationsAndDisposals"
import { preProcessCourtCaseReferenceNumber } from "./normalDisposalGenerator"

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

  const courtCode = getPncCourtCode(hearing.CourtHearingLocation, hearing.CourtHouseCode)
  if (isError(courtCode)) {
    return courtCode
  }

  return {
    operation: PncOperation.DISPOSAL_UPDATED,
    request: {
      ...generateBasePncUpdateRequest(pncUpdateDataset),
      courtCaseReferenceNumber: formattedCourtCaseReference,
      courtCode,
      hearingDate: formatDateSpecifiedInResult(hearing.DateOfHearing, true),
      hearingDetails: generateHearingsAdjudicationsAndDisposals(pncUpdateDataset, courtCaseReference),
      hearingType: DISPOSAL_UPDATED_HEARING_TYPE
    }
  }
}

export default disposalUpdatedGenerator
