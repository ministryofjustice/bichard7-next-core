import type PncUpdateRequestGenerator from "../../types/PncUpdateRequestGenerator"
import formatDateSpecifiedInResult from "../../../phase2/lib/createPncDisposalsFromResult/formatDateSpecifiedInResult"
import type { Operation } from "../../../types/PncUpdateDataset"
import type { Offence, Result } from "../../../types/AnnotatedHearingOutcome"
import isRecordableResult from "../../../phase2/lib/isRecordableResult"
import type { PncOperation } from "../../../types/PncOperation"
import ResultClass from "../../../types/ResultClass"
import isRecordableOffence from "../../../phase2/lib/isRecordableOffence"
import { lookupRemandStatusByCjsCode } from "../../../lib/dataLookup"
import addPaddingToBailCondition from "../addPaddingToBailCondition"
import getPncCourtCode, { PNC_COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR } from "../getPncCourtCode"
import isWarrantIssued from "../../../phase1/lib/result/isWarrantIssued"
import { isError } from "@moj-bichard7/common/types/Result"
import preProcessAsn from "../preProcessAsn"
import preProcessPncIdentifier from "../preProcessPncIdentifier"
import areOrganisationUnitsEqual from "../../../lib/areOrganisationUnitsEqual"

const firstInstanceQualifier = "LE"
const bichardThirdLevelCode = "YZ"
const FAILED_TO_APPEAR_TEXT_FIRST_INSTANCE = "*****1ST INSTANCE WARRANT ISSUED*****"
const FAILED_TO_APPEAR_TEXT = "*****FAILED TO APPEAR*****"
const DEFENDANT_DATED_WARRANT_ISSUED = 4575
const LOCAL_AUTHORITY_CODE = "0000"

const noAdjudicationResultClasses = [
  ResultClass.ADJOURNMENT,
  ResultClass.ADJOURNMENT_PRE_JUDGEMENT,
  ResultClass.ADJOURNMENT_WITH_JUDGEMENT
]

const adjudicationResultClasses = [ResultClass.ADJOURNMENT_POST_JUDGEMENT, ResultClass.ADJOURNMENT_WITH_JUDGEMENT]

const getResultsForRemand = (offences: Offence[], operation: Operation<PncOperation.REMAND>): Result[] => {
  const matchingResults: Result[] = []

  for (const offence of offences.filter(isRecordableOffence)) {
    for (const result of offence.Result.filter(isRecordableResult)) {
      const nextHearingDateMatches =
        (!result.NextHearingDate && !operation.data?.nextHearingDate) ||
        (result.NextHearingDate &&
          new Date(result.NextHearingDate).getTime() === operation.data?.nextHearingDate?.getTime())
      const organisationUnitMatches = areOrganisationUnitsEqual(
        operation.data?.nextHearingLocation,
        result.NextResultSourceOrganisation ?? undefined
      )

      if (!nextHearingDateMatches || !organisationUnitMatches) {
        continue
      }

      const adjudicationExists = result.PNCAdjudicationExists
      const requiresRemand =
        result.ResultClass &&
        (adjudicationExists ? adjudicationResultClasses : noAdjudicationResultClasses).includes(result.ResultClass)

      if (requiresRemand) {
        matchingResults.push(result)
      }
    }
  }

  return matchingResults
}

const generateCourtNameType1 = (
  courtCode: string,
  courtType: string,
  courtHouseName: string,
  remandLocationCourt: string
): string => {
  if (
    courtCode === PNC_COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR &&
    ![FAILED_TO_APPEAR_TEXT, FAILED_TO_APPEAR_TEXT_FIRST_INSTANCE].includes(courtHouseName)
  ) {
    return `${courtHouseName} ${courtType}`
  }

  if (remandLocationCourt === PNC_COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR) {
    return [FAILED_TO_APPEAR_TEXT, FAILED_TO_APPEAR_TEXT_FIRST_INSTANCE].includes(courtHouseName)
      ? courtHouseName
      : `${courtHouseName} ${courtType}`
  }

  return ""
}

const generateCourtNameType2 = (
  courtCode: string,
  courtType: string,
  courtHouseName: string,
  remandLocationCourt: string
): string => {
  if (courtCode === PNC_COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR) {
    return [FAILED_TO_APPEAR_TEXT, FAILED_TO_APPEAR_TEXT_FIRST_INSTANCE].includes(courtHouseName)
      ? courtHouseName
      : `${courtHouseName} ${courtType}`
  }

  if (
    remandLocationCourt === PNC_COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR &&
    ![FAILED_TO_APPEAR_TEXT, FAILED_TO_APPEAR_TEXT_FIRST_INSTANCE].includes(courtHouseName)
  ) {
    return `${courtHouseName} ${courtType}`
  }

  return ""
}

const remandGenerator: PncUpdateRequestGenerator<PncOperation.REMAND> = (pncUpdateDataset, operation) => {
  const hearing = pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Hearing
  const hearingDefendant = pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant

  const pncCheckName = hearingDefendant.PNCCheckname?.split("/")[0].substring(0, 12) ?? null
  const secondLevelCode = pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner?.SecondLevelCode
  const forceStationCode = secondLevelCode ? `${secondLevelCode}${bichardThirdLevelCode}` : "0000"
  const results = getResultsForRemand(hearingDefendant.Offence, operation)

  // TODO: Check if this actually necessary as Phase 2 must have found a result to generate a remand operation
  if (results.length === 0) {
    return new Error("Could not find results to use for remand operation.")
  }

  const pncRemandStatus = lookupRemandStatusByCjsCode(hearingDefendant.RemandStatus)?.pncCode
  const bailConditions = pncRemandStatus === "C" ? [] : hearingDefendant.BailConditions.map(addPaddingToBailCondition)
  const hasFirstInstanceQualifier = results.some((result) =>
    result.ResultQualifierVariable.some((qualifier) => qualifier.Code === firstInstanceQualifier)
  )

  let remandLocationCourt = getPncCourtCode(hearing.CourtHearingLocation, hearing.CourtHouseCode)
  if (isError(remandLocationCourt)) {
    return remandLocationCourt
  }

  let psaCourtCode = getPncCourtCode(results[0].NextResultSourceOrganisation, hearing.CourtHouseCode)
  if (isError(psaCourtCode)) {
    return psaCourtCode
  }

  let courtHouseName = hearing.CourtHouseName
  if (isWarrantIssued(results[0].CJSresultCode)) {
    psaCourtCode = PNC_COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR
    courtHouseName = hasFirstInstanceQualifier ? FAILED_TO_APPEAR_TEXT_FIRST_INSTANCE : FAILED_TO_APPEAR_TEXT
  }

  if (results[0].CJSresultCode === DEFENDANT_DATED_WARRANT_ISSUED) {
    remandLocationCourt = PNC_COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR
    courtHouseName = hasFirstInstanceQualifier ? FAILED_TO_APPEAR_TEXT_FIRST_INSTANCE : FAILED_TO_APPEAR_TEXT
  }

  const courtNameType1 = generateCourtNameType1(
    psaCourtCode,
    hearing.CourtType ?? "",
    courtHouseName ?? "",
    remandLocationCourt
  )

  const courtNameType2 = generateCourtNameType2(
    psaCourtCode,
    hearing.CourtType ?? "",
    courtHouseName ?? "",
    remandLocationCourt
  )

  return {
    operation: "NEWREM",
    request: {
      pncIdentifier: preProcessPncIdentifier(hearingDefendant.PNCIdentifier),
      pncCheckName,
      croNumber: hearingDefendant.CRONumber ?? null,
      arrestSummonsNumber: preProcessAsn(hearingDefendant.ArrestSummonsNumber),
      forceStationCode,
      hearingDate: formatDateSpecifiedInResult(hearing.DateOfHearing, true),
      nextHearingDate: results[0].NextHearingDate
        ? formatDateSpecifiedInResult(new Date(results[0].NextHearingDate), true)
        : "",
      pncRemandStatus: pncRemandStatus ?? "",
      remandLocationCourt,
      psaCourtCode,
      courtNameType1,
      courtNameType2,
      localAuthorityCode: LOCAL_AUTHORITY_CODE,
      bailConditions
    }
  }
}

export default remandGenerator
