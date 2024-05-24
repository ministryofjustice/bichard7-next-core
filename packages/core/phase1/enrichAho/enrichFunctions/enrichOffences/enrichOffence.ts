import type { OffenceCode } from "bichard7-next-data-latest/dist/types/types"
import type { Offence } from "../../../../types/AnnotatedHearingOutcome"

const clearData = (offence: Offence): void => {
  offence.OffenceCategory = undefined
  offence.RecordableOnPNCindicator = undefined
  offence.NotifiableToHOindicator = undefined
  offence.HomeOfficeClassification = undefined
  offence.ResultHalfLifeHours = undefined
}

const enrichOffence = (
  offence: Offence,
  offenceIgnored: boolean,
  offenceCodeLookup: OffenceCode | undefined
): Offence => {
  clearData(offence)
  const reason = offence.CriminalProsecutionReference.OffenceReason
  if (!reason) {
    return offence
  }

  if (offenceIgnored) {
    offence.OffenceCategory = "B7"
    offence.RecordableOnPNCindicator = false
  } else if (offenceCodeLookup?.offenceCategory) {
    offence.OffenceCategory = offenceCodeLookup.offenceCategory
    offence.RecordableOnPNCindicator = offenceCodeLookup.recordableOnPnc
  }

  if (offenceCodeLookup) {
    if (!offence.OffenceTitle) {
      offence.OffenceTitle = offenceCodeLookup.offenceTitle
    }

    offence.NotifiableToHOindicator = offenceCodeLookup.notifiableToHo
    offence.HomeOfficeClassification = offenceCodeLookup.homeOfficeClassification
  }

  return offence
}

export default enrichOffence
