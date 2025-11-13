import type { PncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"

import type { Adjudication, Offence, Plea } from "../../../../types/leds/DisposalRequest"

import {
  type PncUpdateCourtHearingAdjudicationAndDisposal,
  PncUpdateType
} from "../../../../phase3/types/HearingDetails"
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

    const offenceId = findOffenceId(pncUpdateDataset, courtCaseReferenceNumber, ordinary?.courtOffenceSequenceNumber)

    const disposalResults = disposals.map((disposal) => {
      const { count, units, disposalEffectiveDate, amount } = parseDisposalQuantity(disposal.disposalQuantity)

      const disposalDuration = units ? { count, units } : {}

      return {
        disposalCode: Number(disposal.disposalType),
        disposalQualifies: [disposal.disposalQualifiers ?? ""],
        disposalText: disposal.disposalText ?? undefined,
        ...disposalDuration,
        disposalEffectiveDate,
        disposalFine: { amount }
      }
    })

    return {
      courtOffenceSequenceNumber: Number(ordinary?.courtOffenceSequenceNumber),
      cjsOffenceCode: ordinary?.offenceReason ?? "",
      plea: toTitleCase(adjudication?.pleaStatus) as Plea,
      adjudication: toTitleCase(adjudication?.verdict) as Adjudication,
      dateOfSentence: adjudication?.hearingDate,
      offenceTic: Number(adjudication?.numberOffencesTakenIntoAccount),
      disposalResults,
      offenceId
    }
  })

  return offences
}

export default mapOffences
