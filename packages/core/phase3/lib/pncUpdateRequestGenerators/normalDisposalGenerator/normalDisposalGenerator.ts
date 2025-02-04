import type { Result } from "@moj-bichard7/common/types/Result"

import { isError } from "@moj-bichard7/common/types/Result"

import type PncUpdateRequestGenerator from "../../../types/PncUpdateRequestGenerator"

import formatDateSpecifiedInResult from "../../../../lib/results/createPncDisposalsFromResult/formatDateSpecifiedInResult"
import isResultCompatibleWithDisposal from "../../../../lib/results/isResultCompatibleWithDisposal"
import { PncOperation } from "../../../../types/PncOperation"
import generateBasePncUpdateRequest from "../../generateBasePncUpdateRequest"
import getAdjustedRecordableOffencesForCourtCase from "../../getAdjustedRecordableOffencesForCourtCase"
import getPncCourtCode from "../../getPncCourtCode"
import { generateArrestHearingsAdjudicationsAndDisposals } from "../../hearingDetails/generateArrestHearingsAdjudicationsAndDisposals"
import { generateHearingsAdjudicationsAndDisposals } from "../../hearingDetails/generateHearingsAdjudicationsAndDisposals"
import preProcessAsn from "../../preProcessAsn"
import preProcessCourtCaseReferenceNumber from "../../preProcessCourtCaseReferenceNumber"
import deriveGeneratedPncFilename from "./deriveGeneratedPncFilename"
import getNextHearingDateFromOffences from "./getNextHearingDateFromOffences"
import getNextResultSourceOrganisationFromOffences from "./getNextResultSourceOrganisationFromOffences"
import preProcessPreTrialIssuesUniqueReferenceNumber from "./preProcessPreTrialIssuesUniqueReferenceNumber"

const COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR = "9998"
const COURT_TYPE_NOT_AVAILABLE = "Not available from Court"

const preProcessCourtCode = (courtCode: string) => courtCode.padStart(4, "0")

const normalDisposalGenerator: PncUpdateRequestGenerator<PncOperation.NORMAL_DISPOSAL> = (
  pncUpdateDataset,
  operation
) => {
  const hearing = pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Hearing
  const hearingCase = pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case
  const hearingDefendant = hearingCase.HearingDefendant
  const offences = getAdjustedRecordableOffencesForCourtCase(
    hearingDefendant.Offence,
    operation.data?.courtCaseReference
  )

  const courtCaseReference = operation.data?.courtCaseReference ?? hearingCase.CourtCaseReferenceNumber
  const formattedCourtCaseReference = preProcessCourtCaseReferenceNumber(courtCaseReference)
  if (isError(formattedCourtCaseReference)) {
    return formattedCourtCaseReference
  }

  const couPsaCourtCode = getPncCourtCode(hearing.CourtHearingLocation, hearing.CourtHouseCode)
  const nextResultSourceOrganisation = getNextResultSourceOrganisationFromOffences(offences)
  const crtPsaCourtCode = getPncCourtCode(nextResultSourceOrganisation, hearing.CourtHouseCode)
  const courtDate = crtPsaCourtCode ? getNextHearingDateFromOffences(offences) : undefined
  const pendingCourtHouseName =
    crtPsaCourtCode === COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR ? COURT_TYPE_NOT_AVAILABLE : ""

  let arrestSummonsNumber: Result<null | string> = null
  const hasOffencesAddedByTheCourt = offences.some(
    (offence) => offence.AddedByTheCourt && isResultCompatibleWithDisposal(offence)
  )
  if (hasOffencesAddedByTheCourt) {
    arrestSummonsNumber = preProcessAsn(hearingDefendant.ArrestSummonsNumber)
    if (isError(arrestSummonsNumber)) {
      return arrestSummonsNumber
    }
  }

  return {
    operation: PncOperation.NORMAL_DISPOSAL,
    request: {
      ...generateBasePncUpdateRequest(pncUpdateDataset),
      arrestSummonsNumber,
      arrestsAdjudicationsAndDisposals: generateArrestHearingsAdjudicationsAndDisposals(
        pncUpdateDataset,
        operation.data?.courtCaseReference
      ),
      courtCaseReferenceNumber: formattedCourtCaseReference,
      courtHouseName:
        couPsaCourtCode === COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR
          ? `${hearing.CourtHouseName} ${hearing.CourtType}`
          : "",
      dateOfHearing: formatDateSpecifiedInResult(hearing.DateOfHearing, true),
      generatedPNCFilename: deriveGeneratedPncFilename(hearingDefendant),
      hearingsAdjudicationsAndDisposals: generateHearingsAdjudicationsAndDisposals(
        pncUpdateDataset,
        operation.data?.courtCaseReference
      ),
      pendingCourtDate: courtDate ? formatDateSpecifiedInResult(courtDate, true) : null,
      pendingCourtHouseName: crtPsaCourtCode ? pendingCourtHouseName : null,
      pendingPsaCourtCode: crtPsaCourtCode ? preProcessCourtCode(crtPsaCourtCode) : null,
      preTrialIssuesUniqueReferenceNumber: preProcessPreTrialIssuesUniqueReferenceNumber(
        offences,
        courtCaseReference,
        hearingCase.PTIURN,
        hearingCase.ForceOwner?.OrganisationUnitCode ?? undefined
      ),
      psaCourtCode: couPsaCourtCode ? preProcessCourtCode(couPsaCourtCode) : null
    }
  }
}

export default normalDisposalGenerator
