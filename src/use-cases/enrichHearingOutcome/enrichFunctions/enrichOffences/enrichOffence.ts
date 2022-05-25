import type { Offence } from "src/types/AnnotatedHearingOutcome"
import { lookupOffenceByCjsCode } from "src/use-cases/dataLookup"
import isOffenceIgnored from "src/use-cases/isOffenceIgnored"
import getOffenceCode from "src/utils/offence/getOffenceCode"

const enrichOffence = (offence: Offence): Offence => {
  const reason = offence.CriminalProsecutionReference.OffenceReason
  if (!reason) {
    return offence
  }

  const offenceCode = getOffenceCode(offence)
  const offenceIgnored = isOffenceIgnored(offence)
  const offenceCodeLookup = offenceCode ? lookupOffenceByCjsCode(offenceCode) : undefined

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
