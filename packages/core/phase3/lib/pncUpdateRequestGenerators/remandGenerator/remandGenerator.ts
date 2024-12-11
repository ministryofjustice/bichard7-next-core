import { isError } from "@moj-bichard7/common/types/Result"

import type PncUpdateRequestGenerator from "../../../types/PncUpdateRequestGenerator"

import { lookupRemandStatusByCjsCode } from "../../../../lib/dataLookup"
import isDatedWarrantIssued from "../../../../lib/isDatedWarrantIssued"
import isUndatedWarrantIssued from "../../../../lib/isUndatedWarrantIssued"
import formatDateSpecifiedInResult from "../../../../phase2/lib/createPncDisposalsFromResult/formatDateSpecifiedInResult"
import { PncOperation } from "../../../../types/PncOperation"
import addPaddingToBailCondition from "../../addPaddingToBailCondition"
import generateBasePncUpdateRequest from "../../generateBasePncUpdateRequest"
import getPncCourtCode, { PNC_COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR } from "../../getPncCourtCode"
import preProcessAsn from "../../preProcessAsn"
import generateCourtNameType from "./generateCourtNameType"
import getResultsForRemand from "./getResultsForRemand"

const firstInstanceQualifier = "LE"
const FAILED_TO_APPEAR_TEXT_FIRST_INSTANCE = "*****1ST INSTANCE WARRANT ISSUED*****"
const FAILED_TO_APPEAR_TEXT = "*****FAILED TO APPEAR*****"
const FAILED_TO_APPEAR_DATED_TEXT_FIRST_INSTANCE = "*****1ST INSTANCE DATED WARRANT ISSUED*****"
const FAILED_TO_APPEAR_DATED_TEXT = "***** FTA DATED WARRANT *****"
const LOCAL_AUTHORITY_CODE = "0000"

const remandGenerator: PncUpdateRequestGenerator<PncOperation.REMAND> = (pncUpdateDataset, operation) => {
  const hearing = pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Hearing
  const hearingDefendant = pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant
  // TODO: When generating the remand operation in Phase 2, retain the offence and result indexes within the operation.
  //       This avoids the need for this function to find matching results.
  const results = getResultsForRemand(hearingDefendant.Offence, operation)

  // TODO: Check if this actually necessary as Phase 2 must have found a result to generate a remand operation
  if (results.length === 0) {
    return new Error("Could not find results to use for remand operation.")
  }

  const pncRemandStatus = lookupRemandStatusByCjsCode(hearingDefendant.RemandStatus)?.pncCode
  const bailConditions =
    pncRemandStatus === "C" ? [] : hearingDefendant.BailConditions.flatMap(addPaddingToBailCondition)
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
  if (isUndatedWarrantIssued(results[0].CJSresultCode)) {
    psaCourtCode = PNC_COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR
    courtHouseName = hasFirstInstanceQualifier ? FAILED_TO_APPEAR_TEXT_FIRST_INSTANCE : FAILED_TO_APPEAR_TEXT
  }

  if (isDatedWarrantIssued(results[0].CJSresultCode)) {
    remandLocationCourt = PNC_COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR
    courtHouseName = hasFirstInstanceQualifier
      ? FAILED_TO_APPEAR_DATED_TEXT_FIRST_INSTANCE
      : FAILED_TO_APPEAR_DATED_TEXT
  }

  const [courtNameType1, courtNameType2] = generateCourtNameType(
    psaCourtCode,
    hearing.CourtType ?? "",
    courtHouseName ?? "",
    remandLocationCourt
  )

  const arrestSummonsNumber = preProcessAsn(hearingDefendant.ArrestSummonsNumber)
  if (isError(arrestSummonsNumber)) {
    return arrestSummonsNumber
  }

  return {
    operation: PncOperation.REMAND,
    request: {
      ...generateBasePncUpdateRequest(pncUpdateDataset),
      arrestSummonsNumber,
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
