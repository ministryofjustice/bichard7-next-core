import { lookupRemandStatusByCjsCode } from "@moj-bichard7/common/aho/dataLookup/index"
import { PncOperation } from "@moj-bichard7/common/types/PncOperation"
import { isError } from "@moj-bichard7/common/types/Result"

import type PncUpdateRequestGenerator from "../../../types/PncUpdateRequestGenerator"

import formatDateSpecifiedInResult from "../../../../lib/results/createPoliceDisposalsFromResult/formatDateSpecifiedInResult"
import addPaddingToBailCondition from "../../addPaddingToBailCondition"
import generateBasePncUpdateRequest from "../../generateBasePncUpdateRequest"
import preProcessAsn from "../../preProcessAsn"
import generateCourtNameTypes from "./generateCourtNameTypes"
import getCourtHouseName from "./getCourtHouseName"
import getPsaCourtCode from "./getPsaCourtCode"
import getRemandCourtCode from "./getRemandCourtCode"
import getResultsForRemand from "./getResultsForRemand"

const LOCAL_AUTHORITY_CODE = "0000"

const remandGenerator: PncUpdateRequestGenerator<PncOperation.REMAND> = (pncUpdateDataset, operation) => {
  const hearing = pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Hearing
  const hearingDefendant = pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant
  // TODO: When generating the remand operation in Phase 2, retain the offence and result indexes within the operation.
  //       This avoids the need for this function to find matching results.
  const results = getResultsForRemand(hearingDefendant.Offence, operation)

  // TODO: Check if this is actually necessary as Phase 2 must have found a result to generate a remand operation
  if (results.length === 0) {
    return new Error("Could not find results to use for remand operation.")
  }

  const pncRemandStatus = lookupRemandStatusByCjsCode(hearingDefendant.RemandStatus)?.pncCode
  const bailConditions =
    pncRemandStatus === "C" ? [] : hearingDefendant.BailConditions.flatMap(addPaddingToBailCondition)

  const remandCourtCode = getRemandCourtCode(hearing, results)
  const psaCourtCode = getPsaCourtCode(hearing, results)
  const courtHouseName = getCourtHouseName(hearing, results)
  const [courtNameType1, courtNameType2] = generateCourtNameTypes(
    psaCourtCode,
    remandCourtCode,
    hearing.CourtType,
    courtHouseName,
    results
  )

  const arrestSummonsNumber = preProcessAsn(hearingDefendant.ArrestSummonsNumber)
  if (isError(arrestSummonsNumber)) {
    return arrestSummonsNumber
  }

  return {
    operation: PncOperation.REMAND,
    ...(pncUpdateDataset.PncQuery?.personId ? { personId: pncUpdateDataset.PncQuery.personId } : {}),
    ...(pncUpdateDataset.PncQuery?.reportId ? { reportId: pncUpdateDataset.PncQuery.reportId } : {}),
    request: {
      ...generateBasePncUpdateRequest(pncUpdateDataset),
      arrestSummonsNumber,
      hearingDate: formatDateSpecifiedInResult(hearing.DateOfHearing, true),
      nextHearingDate: results[0].NextHearingDate
        ? formatDateSpecifiedInResult(new Date(results[0].NextHearingDate), true)
        : "",
      pncRemandStatus: pncRemandStatus ?? "",
      remandLocationCourt: remandCourtCode,
      psaCourtCode,
      courtNameType1,
      courtNameType2,
      localAuthorityCode: LOCAL_AUTHORITY_CODE,
      bailConditions
    }
  }
}

export default remandGenerator
