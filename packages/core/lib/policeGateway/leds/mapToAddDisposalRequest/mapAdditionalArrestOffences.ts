import type {
  PncUpdateAdjudication,
  PncUpdateArrestHearing,
  PncUpdateDisposal
} from "../../../../phase3/types/HearingDetails"
import type { AdditionalArrestOffences, Adjudication, Plea } from "../../../../types/leds/DisposalRequest"

import {
  type PncUpdateArrestHearingAdjudicationAndDisposal,
  PncUpdateType
} from "../../../../phase3/types/HearingDetails"
import { convertDate, convertTime } from "../dateTimeConverter"
import { parseDisposalQuantity } from "./parseDisposalQuantity"
import { toTitleCase } from "./toTitleCase"

type ArrestGroup = {
  adjudication?: PncUpdateAdjudication
  arrest: PncUpdateArrestHearing
  disposals: PncUpdateDisposal[]
}

const mapAdditionalArrestOffences = (
  asn: string,
  arrestsAdjudicationsAndDisposals: PncUpdateArrestHearingAdjudicationAndDisposal[]
): AdditionalArrestOffences[] => {
  const offenceGroups = arrestsAdjudicationsAndDisposals.reduce<ArrestGroup[]>((groups, item) => {
    switch (item.type) {
      case PncUpdateType.ADJUDICATION:
        groups[groups.length - 1].adjudication = item
        break
      case PncUpdateType.ARREST:
        groups.push({ arrest: item, disposals: [] })
        break
      case PncUpdateType.DISPOSAL:
        groups[groups.length - 1].disposals.push(item)
    }

    return groups
  }, [])

  const additionalOffences = offenceGroups.map(({ arrest, adjudication, disposals }) => {
    const committedOnBail = arrest.committedOnBail?.toLowerCase() === "y"

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
        disposalText: disposal?.disposalText ?? undefined,
        disposalDuration,
        disposalEffectiveDate,
        disposalFine: { amount }
      }
    })

    return {
      courtOffenceSequenceNumber: Number(arrest.courtOffenceSequenceNumber),
      cjsOffenceCode: arrest.offenceReason,
      committedOnBail,
      plea: toTitleCase(adjudication?.pleaStatus) as Plea,
      adjudication: toTitleCase(adjudication?.verdict) as Adjudication,
      dateOfSentence: adjudication?.hearingDate ? convertDate(adjudication.hearingDate) : undefined,
      offenceTic: Number(adjudication?.numberOffencesTakenIntoAccount),
      offenceStartDate: convertDate(arrest.offenceStartDate),
      offenceStartTime: arrest.offenceStartTime ? convertTime(arrest.offenceStartTime) : undefined,
      offenceEndDate: arrest.offenceEndDate ? convertDate(arrest.offenceEndDate) : undefined,
      offenceEndTime: arrest.offenceEndTime ? convertTime(arrest.offenceEndTime) : undefined,
      disposalResults,
      locationFsCode: arrest.offenceLocationFSCode,
      locationText: arrest.locationOfOffence
    }
  })

  return [
    {
      asn,
      additionalOffences
    }
  ]
}

export default mapAdditionalArrestOffences
