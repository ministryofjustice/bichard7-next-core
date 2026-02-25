import type { PncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"

import type { Offence } from "../../../../types/leds/AddDisposalRequest"
import type { Adjudication, Plea } from "../../../../types/leds/DisposalRequest"

import { type PncUpdateCourtHearingAdjudicationAndDisposal } from "../../../../phase3/types/HearingDetails"
import { convertDate } from "../dateTimeConverter"
import preProcessOffenceCode from "../preProcessOffenceCode"
import { findOffenceId } from "./findOffenceId"
import generateOffenceGroups from "./generateOffenceGroups"
import mapDisposalResult from "./mapDisposalResult"
import { toTitleCase } from "./toTitleCase"

const mapOffences = (
  hearingsAdjudicationsAndDisposals: PncUpdateCourtHearingAdjudicationAndDisposal[],
  pncUpdateDataset: PncUpdateDataset,
  courtCaseReferenceNumber: string,
  hearingDate?: string
): Offence[] =>
  generateOffenceGroups(hearingsAdjudicationsAndDisposals).map<Offence>((group) => {
    const { ordinary, adjudication, disposals } = group
    const disposalResults = disposals.map(mapDisposalResult)
    const offenceId = findOffenceId(pncUpdateDataset, courtCaseReferenceNumber, ordinary.courtOffenceSequenceNumber)
    const plea = adjudication?.pleaStatus ? (toTitleCase(adjudication?.pleaStatus) as Plea) : undefined
    const adjudicationResult = adjudication?.verdict ? (toTitleCase(adjudication?.verdict) as Adjudication) : undefined
    const offenceTic = adjudication?.numberOffencesTakenIntoAccount
      ? Number(adjudication?.numberOffencesTakenIntoAccount)
      : undefined
    const { offenceCode: cjsOffenceCode, roleQualifier } = preProcessOffenceCode(ordinary.offenceReason)
    const dateOfSentence = adjudication?.hearingDate
      ? convertDate(adjudication.hearingDate)
      : hearingDate
        ? convertDate(hearingDate)
        : undefined

    return {
      courtOffenceSequenceNumber: Number(ordinary.courtOffenceSequenceNumber),
      cjsOffenceCode,
      roleQualifiers: roleQualifier ? [roleQualifier] : undefined,
      plea,
      adjudication: adjudicationResult,
      dateOfSentence,
      offenceTic,
      disposalResults,
      offenceId
    }
  })

export default mapOffences
