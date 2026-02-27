import type { PncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"

import type { Offence } from "../../../../types/leds/AddDisposalRequest"
import type { Adjudication, Plea } from "../../../../types/leds/DisposalRequest"

import { type PncUpdateCourtHearingAdjudicationAndDisposal } from "../../../../phase3/types/HearingDetails"
import { convertDate } from "../dateTimeConverter"
import preProcessOffenceCode from "../preProcessOffenceCode"
import { findOffenceId } from "./findOffenceId"
import mapDisposalResult from "./mapDisposalResult"
import mergeOffenceDetails from "./mergeOffenceDetails"
import shouldExcludePleaAndAdjudication from "./shouldExcludePleaAndAdjudication"
import { toTitleCase } from "./toTitleCase"

const mapOffences = (
  hearingsAdjudicationsAndDisposals: PncUpdateCourtHearingAdjudicationAndDisposal[],
  pncUpdateDataset: PncUpdateDataset,
  courtCaseReferenceNumber: string,
  isCarriedForwardOrReferredToCourtCase: boolean
): Offence[] =>
  mergeOffenceDetails(hearingsAdjudicationsAndDisposals).map<Offence>((group) => {
    const { ordinary, adjudication, disposals } = group
    const disposalResults = disposals.map(mapDisposalResult)
    const offenceId = findOffenceId(pncUpdateDataset, courtCaseReferenceNumber, ordinary.courtOffenceSequenceNumber)
    const offenceTic = adjudication?.numberOffencesTakenIntoAccount
      ? Number(adjudication?.numberOffencesTakenIntoAccount)
      : undefined
    const { offenceCode: cjsOffenceCode, roleQualifier } = preProcessOffenceCode(ordinary.offenceReason)
    const dateOfSentence = adjudication?.hearingDate ? convertDate(adjudication.hearingDate) : undefined

    const excludePleaAndAdjudication = shouldExcludePleaAndAdjudication(
      disposalResults,
      isCarriedForwardOrReferredToCourtCase
    )
    const plea = !excludePleaAndAdjudication ? (toTitleCase(adjudication?.pleaStatus) as Plea) : undefined
    const verdict = !excludePleaAndAdjudication ? (toTitleCase(adjudication?.verdict) as Adjudication) : undefined

    return {
      courtOffenceSequenceNumber: Number(ordinary.courtOffenceSequenceNumber),
      cjsOffenceCode,
      roleQualifiers: roleQualifier ? [roleQualifier] : undefined,
      plea,
      adjudication: verdict,
      dateOfSentence,
      offenceTic,
      disposalResults,
      offenceId
    }
  })

export default mapOffences
