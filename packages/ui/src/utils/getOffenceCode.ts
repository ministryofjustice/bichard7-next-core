import { Offence } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"

const getOffenceCode = (offence: Offence): string => {
  if (!offence || !offence.CriminalProsecutionReference) {
    return ""
  }

  const {
    CriminalProsecutionReference: { OffenceReason }
  } = offence

  switch (OffenceReason?.__type) {
    case "LocalOffenceReason":
      return OffenceReason.LocalOffenceCode.OffenceCode
    case "NationalOffenceReason":
      return OffenceReason?.OffenceCode.FullCode
    default:
      return ""
  }
}

export default getOffenceCode
