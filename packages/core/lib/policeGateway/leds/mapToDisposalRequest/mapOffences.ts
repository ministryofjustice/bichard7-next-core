import type { PncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"

import type { Adjudication, DisposalDurationUnit, Offence, Plea } from "../../../../types/leds/DisposalRequest"

import {
  type PncUpdateCourtHearingAdjudicationAndDisposal,
  PncUpdateType
} from "../../../../phase3/types/HearingDetails"
import { toTitleCase } from "./toTitleCase"

const findOffenceId = (
  pncUpdateDataset: PncUpdateDataset,
  courtCaseReference: string | undefined,
  offenceSequenceNumber: string | undefined
): string => {
  const sequenceNumber = Number(offenceSequenceNumber)
  const courtCase = pncUpdateDataset.PncQuery?.courtCases?.find((c) => c.courtCaseReference === courtCaseReference)
  const offence = courtCase?.offences.find((o) => o.offence.sequenceNumber === sequenceNumber)

  return offence?.offence.offenceId ?? ""
}

const parseDisposalQuantity = (disposalQuantity: string) => {
  const quantity = disposalQuantity.toLowerCase()
  const durationCode = quantity.slice(0, 1)
  const count = Number(quantity.slice(1, 4).trim()) || 0
  const day = quantity.slice(4, 6)
  const month = quantity.slice(6, 8)
  const year = quantity.slice(8, 12)
  const amount = Number(quantity.slice(12)) || 0
  const disposalEffectiveDate = year && month && day ? `${year}-${month}-${day}` : undefined

  let units: DisposalDurationUnit

  if (quantity.slice(1, 4) === "y999") {
    units = "life"
  } else {
    const unitMap: Record<string, DisposalDurationUnit> = {
      d: "days",
      h: "hours",
      m: "months",
      w: "weeks",
      y: "years"
    }
    units = unitMap[durationCode]
  }

  return { count, units, disposalEffectiveDate, amount }
}

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

      return {
        disposalCode: Number(disposal.disposalType),
        disposalQualifies: [disposal.disposalQualifiers ?? ""],
        disposalText: disposal.disposalText ?? undefined,
        disposalDuration: { count, units },
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
