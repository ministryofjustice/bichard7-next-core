import type { Result } from "@moj-bichard7/common/types/Result"

import { isError } from "@moj-bichard7/common/types/Result"

import type { ArrestHearingAdjudicationAndDisposal } from "../../../types/HearingDetails"
import type PncUpdateRequestGenerator from "../../../types/PncUpdateRequestGenerator"

import formatDateSpecifiedInResult from "../../../../lib/createPncDisposalsFromResult/formatDateSpecifiedInResult"
import getAdjustedRecordableOffencesForCourtCase from "../../../../lib/getAdjustedRecordableOffencesForCourtCase"
import checkRccSegmentApplicability, {
  RccSegmentApplicability
} from "../../../../phase2/lib/getOperationSequence/generateOperations/checkRccSegmentApplicability"
import isResultCompatibleWithDisposal from "../../../../phase2/lib/isResultCompatibleWithDisposal"
import { PncOperation } from "../../../../types/PncOperation"
import generateBasePncUpdateRequest from "../../generateBasePncUpdateRequest"
import getPncCourtCode from "../../getPncCourtCode"
import { generateArrestHearingsAdjudicationsAndDisposals } from "../../hearingDetails/generateArrestHearingsAdjudicationsAndDisposals"
import { generateHearingsAdjudicationsAndDisposals } from "../../hearingDetails/generateHearingsAdjudicationsAndDisposals"
import preProcessAsn from "../../preProcessAsn"
import deriveGeneratedPncFilename from "./deriveGeneratedPncFilename"
import getNextHearingDateFromOffencesList from "./getNextHearingDateFromOffencesList"
import getNextResultSourceOrganisationFromOffences from "./getNextResultSourceOrganisationFromOffences"
import preProcessCourtCaseReferenceNumber from "./preProcessCourtCaseReferenceNumber"
import preProcessPreTrialIssuesUniqueReferenceNumber from "./preProcessPreTrialIssuesUniqueReferenceNumber"

const COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR = "9998"
const COURT_TYPE_NOT_AVAILABLE = "Not available from Court"

const preProcessCourtCode = (courtCode: string) => courtCode.padStart(4, "0")

const normalDisposalGenerator: PncUpdateRequestGenerator<PncOperation.NORMAL_DISPOSAL> = (
  pncUpdateDataset,
  operation
) => {
  const hearing = pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Hearing
  const hearingDefendant = pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant
  const offences = getAdjustedRecordableOffencesForCourtCase(
    hearingDefendant.Offence,
    operation.data?.courtCaseReference
  )

  const courtCaseReference =
    operation.data?.courtCaseReference ??
    pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.CourtCaseReferenceNumber
  const formattedCourtCaseReference = preProcessCourtCaseReferenceNumber(courtCaseReference)
  if (isError(formattedCourtCaseReference)) {
    return formattedCourtCaseReference
  }

  const couPsaCourtCode = getPncCourtCode(hearing.CourtHearingLocation, hearing.CourtHouseCode)
  if (isError(couPsaCourtCode)) {
    return couPsaCourtCode
  }

  const courtHouseName =
    couPsaCourtCode === COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR
      ? `${hearing.CourtHouseName} ${hearing.CourtType}`
      : ""
  const generatedPncFilename = deriveGeneratedPncFilename(hearingDefendant)

  let preTrialIssuesUniqueReferenceNumber: null | string = null
  if (
    checkRccSegmentApplicability(offences, operation.data?.courtCaseReference) ===
    RccSegmentApplicability.CaseRequiresRccAndHasReportableOffences
  ) {
    const forceOwner =
      pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner?.OrganisationUnitCode ?? undefined
    preTrialIssuesUniqueReferenceNumber = preProcessPreTrialIssuesUniqueReferenceNumber(
      pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.PTIURN,
      forceOwner
    )
  }

  const nextResultSourceOrganisation = getNextResultSourceOrganisationFromOffences(offences)
  const crtPsaCourtCode = getPncCourtCode(nextResultSourceOrganisation, hearing.CourtHouseCode)
  if (isError(crtPsaCourtCode)) {
    return crtPsaCourtCode
  }

  const courtDate = crtPsaCourtCode ? getNextHearingDateFromOffencesList(offences) : undefined
  const pendingCourtHouseName =
    crtPsaCourtCode === COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR ? COURT_TYPE_NOT_AVAILABLE : ""
  const hearingsAdjudicationsAndDisposals = generateHearingsAdjudicationsAndDisposals(
    pncUpdateDataset,
    operation.data?.courtCaseReference
  )
  let arrestSummonsNumber: Result<null | string> = null
  let arrestsAdjudicationsAndDisposals: ArrestHearingAdjudicationAndDisposal[] = []
  const hasOffencesAddedByTheCourt = offences.some(
    (offence) => offence.AddedByTheCourt && isResultCompatibleWithDisposal(offence)
  )
  if (hasOffencesAddedByTheCourt) {
    arrestSummonsNumber = preProcessAsn(hearingDefendant.ArrestSummonsNumber)
    if (isError(arrestSummonsNumber)) {
      return arrestSummonsNumber
    }

    arrestsAdjudicationsAndDisposals = generateArrestHearingsAdjudicationsAndDisposals(
      pncUpdateDataset,
      operation.data?.courtCaseReference
    )
  }

  return {
    operation: PncOperation.NORMAL_DISPOSAL,
    request: {
      ...generateBasePncUpdateRequest(pncUpdateDataset),
      arrestSummonsNumber,
      arrestsAdjudicationsAndDisposals,
      courtCaseReferenceNumber: formattedCourtCaseReference,
      courtHouseName,
      dateOfHearing: formatDateSpecifiedInResult(hearing.DateOfHearing, true),
      generatedPNCFilename: generatedPncFilename,
      hearingsAdjudicationsAndDisposals,
      pendingCourtDate: courtDate ? formatDateSpecifiedInResult(courtDate, true) : null,
      pendingCourtHouseName: crtPsaCourtCode ? pendingCourtHouseName : null,
      pendingPsaCourtCode: crtPsaCourtCode ? preProcessCourtCode(crtPsaCourtCode) : null,
      preTrialIssuesUniqueReferenceNumber,
      psaCourtCode: couPsaCourtCode ? preProcessCourtCode(couPsaCourtCode) : null
    }
  }
}

export default normalDisposalGenerator
