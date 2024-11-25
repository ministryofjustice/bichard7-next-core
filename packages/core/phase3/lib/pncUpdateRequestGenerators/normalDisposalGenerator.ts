import type { Result } from "@moj-bichard7/common/types/Result"
import { isError } from "@moj-bichard7/common/types/Result"
import getRecordableOffencesForCourtCase from "../../../lib/getRecordableOffencesForCourtCase"
import { GENERATED_PNC_FILENAME_MAX_LENGTH } from "../../../phase1/enrichAho/enrichFunctions/enrichDefendant/enrichDefendant"
import createPncAdjudicationFromAho from "../../../phase2/lib/createPncAdjudicationFromAho"
import formatDateSpecifiedInResult from "../../../phase2/lib/createPncDisposalsFromResult/formatDateSpecifiedInResult"
import checkRccSegmentApplicability, {
  RccSegmentApplicability
} from "../../../phase2/lib/getOperationSequence/generateOperations/checkRccSegmentApplicability"
import isResultCompatibleWithDisposal from "../../../phase2/lib/isResultCompatibleWithDisposal"
import type {
  HearingDefendant,
  Offence,
  OffenceReason,
  OrganisationUnitCodes
} from "../../../types/AnnotatedHearingOutcome"
import { PncOperation } from "../../../types/PncOperation"
import type { PncAdjudication, PncDisposal } from "../../../types/PncQueryResult"
import type { PncUpdateDataset } from "../../../types/PncUpdateDataset"
import { HearingDetailsType, type HearingAdjudicationAndDisposal } from "../../types/NormalDisposalPncUpdateRequest"
import type PncUpdateRequestGenerator from "../../types/PncUpdateRequestGenerator"
import createPncDisposalFromOffence from "../createPncDisposalFromOffence"
import getForceStationCode from "../getForceStationCode"
import getPncCheckname from "../getPncCheckname"
import getPncCourtCode from "../getPncCourtCode"
import preProcessAsn from "../preProcessAsn"
import preProcessPncIdentifier from "../preProcessPncIdentifier"

const COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR = "9998"
const ILLEGAL_FILENAME_PATTERN = new RegExp("[^a-zA-Z0-9\\- /]", "g")
const COURT_TYPE_NOT_AVAILABLE = "Not available from Court"
const DEFAULT_OFFENCE_LOCATION = "Not provided by Court"

const has2059Or2060Result = (offence: Offence) =>
  offence.Result.some((result) => [2059, 2060].includes(result.PNCDisposalType ?? 0))

const adjust2060ResultIfNecessary = (offences: Offence[]) => {
  const found2059Or2060Result = offences.some((offence) => has2059Or2060Result(offence))
  const foundNon2059Or2060Offence = offences.some(
    (offence) => (!offence.AddedByTheCourt || isResultCompatibleWithDisposal(offence)) && !has2059Or2060Result(offence)
  )

  if (!found2059Or2060Result || foundNon2059Or2060Offence) {
    return
  }

  offences.forEach((offence) =>
    offence.Result.forEach(
      (result) => (result.PNCDisposalType = result.PNCDisposalType === 2060 ? 2063 : result.PNCDisposalType)
    )
  )
}

const preProcessCourtCaseReferenceNumber = (ccr?: string): Result<string> => {
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
    .replace(/\\s+/g, " ")
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

const convertHoOffenceCodeToPncFormat = (offCode?: OffenceReason): string => {
  if (!offCode) {
    return ""
  }

  if (offCode.__type !== "NationalOffenceReason") {
    return offCode.LocalOffenceCode.OffenceCode
  }

  const offenceReason: (string | undefined)[] = []
  if (offCode.OffenceCode.__type === "NonMatchingOffenceCode" && offCode.OffenceCode.ActOrSource) {
    offenceReason.push(offCode.OffenceCode.ActOrSource)
    offenceReason.push(offCode.OffenceCode.Year)
  } else if (offCode.OffenceCode.__type === "IndictmentOffenceCode" && offCode.OffenceCode.Indictment) {
    offenceReason.push(offCode.OffenceCode.Indictment)
  } else if (offCode.OffenceCode.__type === "CommonLawOffenceCode" && offCode.OffenceCode.CommonLawOffence) {
    offenceReason.push(offCode.OffenceCode.CommonLawOffence)
  }

  offenceReason.push(offCode.OffenceCode.Reason)
  offenceReason.push(offCode.OffenceCode.Qualifier)

  return offenceReason.join("")
}

const preProcessOffenceReasonSequence = (offence: Offence): string =>
  offence.CriminalProsecutionReference.OffenceReasonSequence?.padStart(3, "0") ?? ""

const OFFENCE_START_TIME_FIELD_LENGTH = 4
const MIDNIGHT_TIME_STRING = "0000"
const ONE_MINUTE_PAST_MIDNIGHT_TIME_STRING = "0001"
const preProcessTimeString = (timeString?: string) =>
  timeString
    ? timeString
        ?.replace(/:/g, "")
        .padStart(OFFENCE_START_TIME_FIELD_LENGTH, "0")
        .replace(MIDNIGHT_TIME_STRING, ONE_MINUTE_PAST_MIDNIGHT_TIME_STRING)
    : ""

type Cch = {
  offenceCode: string
  offenceReasonSequence?: string
}

type AddedByCourtHearing = {
  offenceReasonSequence: string
  offenceCode: string
  committedOnBail: string
  locationOfOffence: string
  offenceLocationFsCode: string
  offenceStartDate: string
  offenceStartTime: string
  offenceEndDate: string
  offenceEndTime: string
}

const convertDis = (disposal: PncDisposal): HearingAdjudicationAndDisposal => ({
  disposalType: disposal.type !== undefined ? String(disposal.type) : null,
  disposalQuantity: disposal.qtyUnitsFined ?? null,
  disposalQualifiers: disposal.qualifiers ?? null,
  disposalText: disposal.text ?? null,
  committedOnBail: null,
  courtOffenceSequenceNumber: null,
  hearingDate: null,
  locationOfOffence: null,
  numberOffencesTakenIntoAccount: null,
  offenceEndDate: null,
  offenceEndTime: null,
  offenceLocationFSCode: null,
  offenceReason: null,
  offenceReasonSequence: null,
  offenceStartDate: null,
  offenceStartTime: null,
  pleaStatus: null,
  type: HearingDetailsType.DISPOSAL,
  verdict: null
})

const convertAdj = (adjudication: PncAdjudication): HearingAdjudicationAndDisposal => ({
  disposalType: null,
  disposalQuantity: null,
  disposalQualifiers: null,
  disposalText: null,
  committedOnBail: null,
  courtOffenceSequenceNumber: null,
  hearingDate: adjudication.sentenceDate ? formatDateSpecifiedInResult(adjudication.sentenceDate, true) : "",
  locationOfOffence: null,
  numberOffencesTakenIntoAccount: adjudication.offenceTICNumber?.toString().padStart(4, "0") ?? "",
  offenceEndDate: null,
  offenceEndTime: null,
  offenceLocationFSCode: null,
  offenceReason: null,
  offenceReasonSequence: null,
  offenceStartDate: null,
  offenceStartTime: null,
  pleaStatus: adjudication.plea,
  type: HearingDetailsType.ADJUDICATION,
  verdict: adjudication.verdict
})

const convertCch = (cch: Cch): HearingAdjudicationAndDisposal => ({
  disposalType: null,
  disposalQuantity: null,
  disposalQualifiers: null,
  disposalText: null,
  committedOnBail: null,
  courtOffenceSequenceNumber: cch.offenceReasonSequence ?? null,
  hearingDate: null,
  locationOfOffence: null,
  numberOffencesTakenIntoAccount: null,
  offenceEndDate: null,
  offenceEndTime: null,
  offenceLocationFSCode: null,
  offenceReason: cch.offenceCode,
  offenceReasonSequence: null,
  offenceStartDate: null,
  offenceStartTime: null,
  pleaStatus: null,
  type: HearingDetailsType.ORDINARY,
  verdict: null
})

const convertAch = (ach: AddedByCourtHearing): HearingAdjudicationAndDisposal => ({
  disposalType: null,
  disposalQuantity: null,
  disposalQualifiers: null,
  disposalText: null,
  committedOnBail: ach.committedOnBail ?? null,
  courtOffenceSequenceNumber: ach.offenceReasonSequence || null,
  hearingDate: null,
  locationOfOffence: ach.locationOfOffence,
  numberOffencesTakenIntoAccount: null,
  offenceEndDate: ach.offenceEndDate,
  offenceEndTime: ach.offenceEndTime,
  offenceLocationFSCode: ach.offenceLocationFsCode,
  offenceReason: ach.offenceCode,
  offenceReasonSequence: ach.offenceReasonSequence || "",
  offenceStartDate: ach.offenceStartDate,
  offenceStartTime: ach.offenceStartTime,
  pleaStatus: null,
  type: HearingDetailsType.ARREST,
  verdict: null
})

const generateHearingsAdjudicationsAndDisposals = (pncUpdateDataset: PncUpdateDataset, offences: Offence[]) =>
  offences
    .filter((offence) => !offence.AddedByTheCourt)
    .reduce((acc: HearingAdjudicationAndDisposal[], offence) => {
      acc.push(
        convertCch({
          offenceCode: convertHoOffenceCodeToPncFormat(offence.CriminalProsecutionReference.OffenceReason),
          offenceReasonSequence: preProcessOffenceReasonSequence(offence)
        })
      )

      const adj = createPncAdjudicationFromAho(
        offence.Result,
        pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Hearing.DateOfHearing
      )
      if (adj) {
        acc.push(convertAdj(adj))
      }

      const disposalsList = createPncDisposalFromOffence(pncUpdateDataset, offence)
      acc.push(...disposalsList.map(convertDis))

      return acc
    }, [])

const getOffencesAddedByTheCourt = (offences: Offence[]) =>
  offences.filter((offence) => offence.AddedByTheCourt && isResultCompatibleWithDisposal(offence))

const generateArrestsAdjudicationsAndDisposals = (pncUpdateDataset: PncUpdateDataset, offences: Offence[]) =>
  getOffencesAddedByTheCourt(offences).reduce((acc: HearingAdjudicationAndDisposal[], offence) => {
    const offenceStartDate = formatDateSpecifiedInResult(offence.ActualOffenceStartDate.StartDate, true)
    const offenceEndDate = offence.ActualOffenceEndDate?.EndDate
      ? formatDateSpecifiedInResult(offence.ActualOffenceEndDate.EndDate, true)
      : ""
    const offenceTimeStartTime = offence.OffenceTime ?? offence.StartTime ?? ""
    acc.push(
      convertAch({
        offenceCode: convertHoOffenceCodeToPncFormat(offence.CriminalProsecutionReference.OffenceReason),
        offenceReasonSequence: preProcessOffenceReasonSequence(offence),
        committedOnBail: offence.CommittedOnBail?.toUpperCase() === "Y" ? "Y" : "N",
        locationOfOffence: offence.LocationOfOffence ?? DEFAULT_OFFENCE_LOCATION,
        offenceStartDate,
        offenceEndDate,
        offenceStartTime: preProcessTimeString(offenceTimeStartTime),
        offenceEndTime: preProcessTimeString(offence.OffenceEndTime),
        offenceLocationFsCode: getForceStationCode(pncUpdateDataset, false)
      })
    )

    const pncAdjudication = createPncAdjudicationFromAho(
      offence.Result,
      pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Hearing.DateOfHearing
    )
    if (pncAdjudication) {
      acc.push(convertAdj(pncAdjudication))
    }

    const disposalsList = createPncDisposalFromOffence(pncUpdateDataset, offence)
    acc.push(...disposalsList.map(convertDis))

    return acc
  }, [])

const normalDisposalGenerator: PncUpdateRequestGenerator<PncOperation.NORMAL_DISPOSAL> = (
  pncUpdateDataset,
  operation
) => {
  const hearing = pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Hearing
  const hearingDefendant = pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant
  // TODO: Implement NormalDisposalMessageDispatcher.java:113
  const offences = getRecordableOffencesForCourtCase(pncUpdateDataset, operation.data?.courtCaseReference)

  // TODO: Refactor to avoid mutation
  adjust2060ResultIfNecessary(offences)

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

  let preTrialIssuesUniqueReferenceNumber: string | null = null
  if (
    checkRccSegmentApplicability(pncUpdateDataset, operation.data?.courtCaseReference) ===
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

  const hearingsAdjudicationsAndDisposals = generateHearingsAdjudicationsAndDisposals(pncUpdateDataset, offences)
  const forceStationCode = getForceStationCode(pncUpdateDataset, true)
  let arrestSummonsNumber: string | null | Error = null
  let arrestsAdjudicationsAndDisposals: HearingAdjudicationAndDisposal[] = []
  if (offencesAddedByTheCourt.length > 0) {
    arrestSummonsNumber = preProcessAsn(hearingDefendant.ArrestSummonsNumber)
    if (isError(arrestSummonsNumber)) {
      return arrestSummonsNumber
    }

    arrestsAdjudicationsAndDisposals = generateArrestsAdjudicationsAndDisposals(pncUpdateDataset, offences)
  }

  return {
    operation: PncOperation.NORMAL_DISPOSAL,
    request: {
      arrestSummonsNumber,
      arrestsAdjudicationsAndDisposals,
      courtCaseReferenceNumber: formattedCourtCaseReference,
      courtHouseName,
      croNumber: hearingDefendant.CRONumber ?? null,
      dateOfHearing: formatDateSpecifiedInResult(hearing.DateOfHearing, true),
      forceStationCode,
      generatedPNCFilename: generatedPNCFilename,
      hearingsAdjudicationsAndDisposals,
      pendingCourtDate: courtDate ? formatDateSpecifiedInResult(courtDate, true) : null,
      pendingCourtHouseName: crtPsaCourtCode ? pendingCourtHouseName : null,
      pendingPsaCourtCode: crtPsaCourtCode ? preProcessCourtCode(crtPsaCourtCode) : null,
      pncCheckName: getPncCheckname(pncUpdateDataset),
      pncIdentifier: preProcessPncIdentifier(hearingDefendant.PNCIdentifier),
      preTrialIssuesUniqueReferenceNumber,
      psaCourtCode: couPsaCourtCode ? preProcessCourtCode(couPsaCourtCode) : null
    }
  }
}

export default normalDisposalGenerator
