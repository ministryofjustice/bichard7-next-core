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
      const disposalQuantity = parseDisposalQuantity(disposal.disposalQuantity)
      const { disposalDuration, disposalEffectiveDate, amount } = disposalQuantity ?? {
        disposalDuration: undefined,
        disposalEffectiveDate: undefined,
        amount: 0
      }

      const disposalQualifiers = disposal.disposalQualifiers
        ?.match(/.{1,2}/g)
        ?.map((q) => q.trim())
        .filter(Boolean)

      return {
        disposalCode: Number(disposal.disposalType),
        disposalQualifiers,
        disposalText: disposal.disposalText || undefined,
        disposalDuration,
        disposalEffectiveDate,
        disposalFine: { amount }
      }
    })
    const offenceId = findOffenceId(pncUpdateDataset, courtCaseReferenceNumber, ordinary?.courtOffenceSequenceNumber)
    const plea = toTitleCase(adjudication?.pleaStatus) as Plea
    const adjudicationResult = toTitleCase(adjudication?.verdict) as Adjudication
    const offenceTic = adjudication?.numberOffencesTakenIntoAccount
      ? Number(adjudication?.numberOffencesTakenIntoAccount)
      : undefined
    const dateOfSentence = adjudication?.hearingDate ? convertDate(adjudication.hearingDate) : undefined

    return {
      courtOffenceSequenceNumber: Number(ordinary?.courtOffenceSequenceNumber),
      cjsOffenceCode: ordinary?.offenceReason ?? "",
      plea,
      adjudication: adjudicationResult,
      ...(dateOfSentence && { dateOfSentence }),
      offenceTic,
      disposalResults,
      offenceId
    }
  })

  return offences
}

export default mapOffences
