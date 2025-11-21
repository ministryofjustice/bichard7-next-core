import type { PncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"

import type { Adjudication, Offence, Plea } from "../../../../types/leds/DisposalRequest"

import {
  type PncUpdateCourtHearingAdjudicationAndDisposal,
  PncUpdateType
} from "../../../../phase3/types/HearingDetails"
import { convertDate } from "../dateTimeConverter"
import { findOffenceId } from "./findOffenceId"
import { parseDisposalQuantity } from "./parseDisposalQuantity"
import { toTitleCase } from "./toTitleCase"

const mapOffences = (
  hearingsAdjudicationsAndDisposals: PncUpdateCourtHearingAdjudicationAndDisposal[],
  pncUpdateDataset: PncUpdateDataset,
  courtCaseReferenceNumber: string
): Offence[] => {
  const offenceGroups = hearingsAdjudicationsAndDisposals.reduce<PncUpdateCourtHearingAdjudicationAndDisposal[][]>(
    (groups, item) => {
      if (item.type === PncUpdateType.ORDINARY || groups.length === 0) {
        groups.push([])
      }

      groups[groups.length - 1].push(item)

      return groups
    },
    []
  )

  const offences = offenceGroups.map((group) => {
    const ordinary = group.find((el) => el.type === PncUpdateType.ORDINARY)
    const adjudication = group.find((el) => el.type === PncUpdateType.ADJUDICATION)
    const disposals = group.filter((el) => el.type === PncUpdateType.DISPOSAL)

    const disposalResults = disposals.map((disposal) => {
      const { count, units, disposalEffectiveDate, amount } = parseDisposalQuantity(disposal.disposalQuantity)

      return {
        disposalCode: Number(disposal.disposalType),
        disposalQualifiers: disposal.disposalQualifiers ? [disposal.disposalQualifiers] : [],
        disposalText: disposal.disposalText ?? undefined,
        ...(units && { disposalDuration: { count, units } }),
        disposalEffectiveDate,
        disposalFine: { amount }
      }
    })
    const offenceId = findOffenceId(pncUpdateDataset, courtCaseReferenceNumber, ordinary?.courtOffenceSequenceNumber)
    const plea = adjudication?.pleaStatus ? (toTitleCase(adjudication?.pleaStatus) as Plea) : undefined
    const adjudicationResult = adjudication?.verdict ? (toTitleCase(adjudication?.verdict) as Adjudication) : undefined
    const offenceTic = adjudication?.numberOffencesTakenIntoAccount
      ? Number(adjudication?.numberOffencesTakenIntoAccount)
      : undefined

    return {
      courtOffenceSequenceNumber: Number(ordinary?.courtOffenceSequenceNumber),
      cjsOffenceCode: ordinary?.offenceReason ?? "",
      plea,
      adjudication: adjudicationResult,
      dateOfSentence: adjudication?.hearingDate ? convertDate(adjudication.hearingDate) : undefined,
      offenceTic,
      disposalResults,
      offenceId
    }
  })

  return offences
}

export default mapOffences
