import type {
  PncUpdateAdjudication,
  PncUpdateArrestHearing,
  PncUpdateArrestHearingAdjudicationAndDisposal,
  PncUpdateCourtHearing,
  PncUpdateCourtHearingAdjudicationAndDisposal,
  PncUpdateDisposal
} from "../../../../phase3/types/HearingDetails"

import { PncUpdateType } from "../../../../phase3/types/HearingDetails"

type ArrestOffenceGroup = {
  adjudication?: PncUpdateAdjudication
  arrest: PncUpdateArrestHearing
  disposals: PncUpdateDisposal[]
}

type MergedOffenceDetails<T> = [T] extends [PncUpdateArrestHearingAdjudicationAndDisposal]
  ? ArrestOffenceGroup
  : OffenceGroup
type OffenceData = PncUpdateArrestHearingAdjudicationAndDisposal | PncUpdateCourtHearingAdjudicationAndDisposal

type OffenceGroup = {
  adjudication?: PncUpdateAdjudication
  disposals: PncUpdateDisposal[]
  ordinary: PncUpdateCourtHearing
}

const mergeOffenceDetails = <T extends OffenceData>(offenceData: T[]): MergedOffenceDetails<T>[] =>
  offenceData.reduce<MergedOffenceDetails<T>[]>((groups, item) => {
    switch (item.type) {
      case PncUpdateType.ADJUDICATION:
        groups[groups.length - 1].adjudication = item
        break
      case PncUpdateType.ARREST:
        ;(groups as ArrestOffenceGroup[]).push({ arrest: item, disposals: [] })
        break
      case PncUpdateType.ORDINARY:
        ;(groups as OffenceGroup[]).push({ ordinary: item, disposals: [] })
        break
      case PncUpdateType.DISPOSAL:
        groups[groups.length - 1].disposals.push(item)
    }

    return groups
  }, [])

export default mergeOffenceDetails
