import { isError } from "@moj-bichard7/common/types/Result"

import type PncUpdateRequestGenerator from "../../types/PncUpdateRequestGenerator"

import formatDateSpecifiedInResult from "../../../phase2/lib/createPncDisposalsFromResult/formatDateSpecifiedInResult"
import { PncOperation } from "../../../types/PncOperation"
import generateBasePncUpdateRequest from "../generateBasePncUpdateRequest"
import getPncCourtCode from "../getPncCourtCode"
import { generateHearingsAndDisposals } from "../hearingDetails/generateHearingsAndDisposals"
import { preProcessCourtCaseReferenceNumber } from "./normalDisposalGenerator"

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

  const courtCode = getPncCourtCode(hearing.CourtHearingLocation, hearing.CourtHouseCode)
  if (isError(courtCode)) {
    return courtCode
  }

  return {
    operation: PncOperation.SENTENCE_DEFERRED,
    request: {
      ...generateBasePncUpdateRequest(pncUpdateDataset),
      courtCaseReferenceNumber: formattedCourtCaseReference,
      courtCode,
      hearingDate: formatDateSpecifiedInResult(hearing.DateOfHearing, true),
      hearingDetails: generateHearingsAndDisposals(pncUpdateDataset, courtCaseReference),
      hearingType: SENTENCE_DEFERRED_HEARING_TYPE
    }
  }
}

export default sentenceDeferredGenerator
