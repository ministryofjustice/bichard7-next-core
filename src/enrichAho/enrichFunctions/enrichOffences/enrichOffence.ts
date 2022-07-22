import type { OffenceCode } from "bichard7-next-data-latest/dist/types/types"
import type { Offence } from "src/types/AnnotatedHearingOutcome"

const enrichOffence = (
  offence: Offence,
  offenceIgnored: boolean,
  offenceCodeLookup: OffenceCode | undefined
): Offence => {
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
    offence.OffenceTitle = offenceCodeLookup.offenceTitle
    offence.NotifiableToHOindicator = offenceCodeLookup.notifiableToHo
    offence.HomeOfficeClassification = offenceCodeLookup.homeOfficeClassification
    if (offenceCodeLookup.resultHalfLifeHours) {
      offence.ResultHalfLifeHours = parseInt(offenceCodeLookup.resultHalfLifeHours, 10)
    }
  }

  return offence
}

export default enrichOffence
