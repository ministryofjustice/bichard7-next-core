import type { Result } from "@moj-bichard7/common/types/Result"

import { isError } from "@moj-bichard7/common/types/Result"

import type { HearingDefendant, Offence, OrganisationUnitCodes } from "../../../types/AnnotatedHearingOutcome"
import type { ArrestHearingAdjudicationAndDisposal } from "../../types/HearingDetails"
import type PncUpdateRequestGenerator from "../../types/PncUpdateRequestGenerator"

import getAdjustedRecordableOffencesForCourtCase from "../../../lib/getAdjustedRecordableOffencesForCourtCase"
import { GENERATED_PNC_FILENAME_MAX_LENGTH } from "../../../phase1/enrichAho/enrichFunctions/enrichDefendant/enrichDefendant"
import formatDateSpecifiedInResult from "../../../phase2/lib/createPncDisposalsFromResult/formatDateSpecifiedInResult"
import checkRccSegmentApplicability, {
  RccSegmentApplicability
} from "../../../phase2/lib/getOperationSequence/generateOperations/checkRccSegmentApplicability"
import isResultCompatibleWithDisposal from "../../../phase2/lib/isResultCompatibleWithDisposal"
import { PncOperation } from "../../../types/PncOperation"
import generateBasePncUpdateRequest from "../generateBasePncUpdateRequest"
import getPncCourtCode from "../getPncCourtCode"
import { generateArrestHearingsAdjudicationsAndDisposals } from "../hearingDetails/generateArrestHearingsAdjudicationsAndDisposals"
import { generateHearingsAdjudicationsAndDisposals } from "../hearingDetails/generateHearingsAdjudicationsAndDisposals"
import preProcessAsn from "../preProcessAsn"

const COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR = "9998"
const ILLEGAL_FILENAME_PATTERN = new RegExp("[^a-zA-Z0-9\\- /]", "g")
const COURT_TYPE_NOT_AVAILABLE = "Not available from Court"

export const preProcessCourtCaseReferenceNumber = (ccr?: string): Result<string> => {
  if (!ccr) {
    return ""
  }

  if (ccr.length !== 15) {
    return new Error(`Court Case Reference Number length is invalid. The length is ${ccr.length}`)
  }

  const year = ccr.substring(0, 2)
  const courtCode = ccr.substring(3, 7)
  const sequentialNumber = ccr.substring(8, 14)
  const sequentialNumberWithoutLeadingZeroes =
    sequentialNumber.match(/0*(?<sequentialNumber>.*)/)?.groups?.sequentialNumber
  const checkCharacter = ccr.substring(14)

  return `${year}/${courtCode}/${sequentialNumberWithoutLeadingZeroes}${checkCharacter}`
}

const preProcessCourtCode = (courtCode: string) => courtCode.padStart(4, "0")

const deriveGeneratedPNCFilename = (defendant: HearingDefendant) => {
  if (defendant.DefendantDetail != null) {
    const generatedPNCFilename = defendant.DefendantDetail?.GeneratedPNCFilename ?? ""
    return generatedPNCFilename.includes("/") ? generatedPNCFilename : `${generatedPNCFilename}/`
  }

  let generatedPNCFilename = defendant.OrganisationName?.replace(ILLEGAL_FILENAME_PATTERN, " ")
    .replace(/\s+/g, " ")
    .trim()

  if (!generatedPNCFilename) {
    return ""
  }

  if (generatedPNCFilename.length > GENERATED_PNC_FILENAME_MAX_LENGTH) {
    generatedPNCFilename = generatedPNCFilename.substring(0, GENERATED_PNC_FILENAME_MAX_LENGTH - 1) + "+"
  }

  // if there is no / in the name, add one
  if (!generatedPNCFilename.includes("/")) {
    if (generatedPNCFilename.length == GENERATED_PNC_FILENAME_MAX_LENGTH) {
      generatedPNCFilename = generatedPNCFilename.substring(0, GENERATED_PNC_FILENAME_MAX_LENGTH - 2) + "/+"
    } else {
      generatedPNCFilename = generatedPNCFilename + "/"
    }
  }

  return generatedPNCFilename
}

const preProcessPreTrialIssuesUniqueReferenceNumber = (ptiUrn?: string, forceOwner?: string) => {
  const formattedPtiUrn: (string | undefined)[] = []
  if (forceOwner && forceOwner.length == 6) {
    formattedPtiUrn.push(forceOwner.substring(0, 4))
  } else if (ptiUrn) {
    formattedPtiUrn.push(ptiUrn.substring(0, 4).padStart(4, " "))
  } else {
    formattedPtiUrn.push(" ".repeat(4))
  }

  formattedPtiUrn.push(`/${ptiUrn?.substring(4, 18)}`)

  return formattedPtiUrn.join("")
}

const getCourtCodeFromOffences = (offences: Offence[]): OrganisationUnitCodes | undefined =>
  offences
    .flatMap((offence) => offence.Result)
    .find((result) => result.NextResultSourceOrganisation && result.PNCDisposalType === 2059)
    ?.NextResultSourceOrganisation ?? undefined

const getCourtDateFromOffencesList = (offences: Offence[]): Date | undefined => {
  const nextHearingDate =
    offences.flatMap((offence) => offence.Result).find((result) => result.PNCDisposalType === 2059)?.NextHearingDate ??
    undefined

  return nextHearingDate ? new Date(nextHearingDate) : undefined
}

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
  const generatedPNCFilename = deriveGeneratedPNCFilename(hearingDefendant)

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

  const nextResultSourceOrganisation = getCourtCodeFromOffences(offences)
  const crtPsaCourtCode = getPncCourtCode(nextResultSourceOrganisation, hearing.CourtHouseCode)
  if (isError(crtPsaCourtCode)) {
    return crtPsaCourtCode
  }

  const courtDate = crtPsaCourtCode ? getCourtDateFromOffencesList(offences) : undefined
  const pendingCourtHouseName =
    crtPsaCourtCode === COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR ? COURT_TYPE_NOT_AVAILABLE : ""

  const offencesAddedByTheCourt = offences.filter(
    (offence) => offence.AddedByTheCourt && isResultCompatibleWithDisposal(offence)
  )

  const hearingsAdjudicationsAndDisposals = generateHearingsAdjudicationsAndDisposals(
    pncUpdateDataset,
    operation.data?.courtCaseReference
  )
  let arrestSummonsNumber: Error | null | string = null
  let arrestsAdjudicationsAndDisposals: ArrestHearingAdjudicationAndDisposal[] = []
  if (offencesAddedByTheCourt.length > 0) {
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
      generatedPNCFilename: generatedPNCFilename,
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
