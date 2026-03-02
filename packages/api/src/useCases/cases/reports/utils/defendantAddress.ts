import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

export const defendantAddress = (aho: AnnotatedHearingOutcome): string => {
  const address = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Address

  return [address.AddressLine1, address.AddressLine2, address.AddressLine3, address.AddressLine4, address.AddressLine5]
    .filter((line): line is string => !!line)
    .join(", ")
}
