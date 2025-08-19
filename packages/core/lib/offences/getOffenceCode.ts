import type { Offence } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

const getOffenceCode = (offence: Offence): string | undefined => {
  const offenceReason = offence.CriminalProsecutionReference.OffenceReason

  if (!offenceReason) {
    return undefined
  }

  if (offenceReason.__type == "LocalOffenceReason") {
    return offenceReason.LocalOffenceCode.OffenceCode
  }

  return offenceReason.OffenceCode.FullCode
}

export default getOffenceCode
