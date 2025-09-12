import { PncOperation } from "@moj-bichard7/common/types/PncOperation"
import { isError } from "@moj-bichard7/common/types/Result"

import type PncUpdateRequestGenerator from "../../types/PncUpdateRequestGenerator"

import formatDateSpecifiedInResult from "../../../lib/results/createPoliceDisposalsFromResult/formatDateSpecifiedInResult"
import generateBasePncUpdateRequest from "../generateBasePncUpdateRequest"
import getPncCourtCode from "../getPncCourtCode"
import { generateHearingsAndDisposals } from "../hearingDetails/generateHearingsAndDisposals"
import preProcessCourtCaseReferenceNumber from "../preProcessCourtCaseReferenceNumber"

const SENTENCE_DEFERRED_HEARING_TYPE = "D"

const sentenceDeferredGenerator: PncUpdateRequestGenerator<PncOperation.SENTENCE_DEFERRED> = (
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
    operation: PncOperation.SENTENCE_DEFERRED,
    request: {
      ...generateBasePncUpdateRequest(pncUpdateDataset),
      courtCaseReferenceNumber: formattedCourtCaseReference,
      courtCode: getPncCourtCode(hearing.CourtHearingLocation, hearing.CourtHouseCode),
      hearingDate: formatDateSpecifiedInResult(hearing.DateOfHearing, true),
      hearingDetails: generateHearingsAndDisposals(pncUpdateDataset, courtCaseReference),
      hearingType: SENTENCE_DEFERRED_HEARING_TYPE
    }
  }
}

export default sentenceDeferredGenerator
