import type { AdditionalArrestOffences, Adjudication, Plea } from "../../../../types/leds/DisposalRequest"

import {
  type PncUpdateArrestHearingAdjudicationAndDisposal,
  PncUpdateType
} from "../../../../phase3/types/HearingDetails"
import { toTitleCase } from "./toTitleCase"

const mapAdditionalArrestOffences = (
  asn: null | string,
  arrestsAdjudicationsAndDisposals: PncUpdateArrestHearingAdjudicationAndDisposal[]
): AdditionalArrestOffences[] => {
  const offenceGroups = arrestsAdjudicationsAndDisposals.reduce<PncUpdateArrestHearingAdjudicationAndDisposal[][]>(
    (groups, item) => {
      if (item.type === PncUpdateType.ARREST || groups.length === 0) {
        groups.push([])
      }

      groups[groups.length - 1].push(item)
      return groups
    },
    []
  )

  const additionalOffences = offenceGroups.map((group) => {
    const arrest = group.find((el) => el.type === PncUpdateType.ARREST)
    const adjudication = group.find((el) => el.type === PncUpdateType.ADJUDICATION)
    const disposals = group.filter((el) => el.type === PncUpdateType.DISPOSAL)

    const committedOnBail = arrest?.committedOnBail.toLowerCase() === "y"
    const disposalResults = disposals.map((disposal) => ({
      disposalCode: Number(disposal.disposalType),
      disposalQualifies: [disposal.disposalQualifiers ?? ""],
      disposalText: disposal?.disposalText ?? undefined
    }))

    return {
      courtOffenceSequenceNumber: Number(arrest?.courtOffenceSequenceNumber),
      cjsOffenceCode: arrest?.offenceReason ?? "",
      committedOnBail,
      plea: toTitleCase(adjudication?.pleaStatus) as Plea,
      adjudication: toTitleCase(adjudication?.verdict) as Adjudication,
      dateOfSentence: adjudication?.hearingDate,
      offenceTic: Number(adjudication?.numberOffencesTakenIntoAccount),
      offenceStartDate: arrest?.offenceStartDate ?? "",
      offenceStartTime: arrest?.offenceStartTime,
      offenceEndDate: arrest?.offenceEndDate,
      offenceEndTime: arrest?.offenceEndTime,
      disposalResults,
      locationFsCode: arrest?.offenceLocationFSCode ?? "",
      locationText: arrest?.locationOfOffence
    }
  })

  return [
    {
      asn: asn ?? "",
      additionalOffences
    }
  ]
}

export default mapAdditionalArrestOffences
