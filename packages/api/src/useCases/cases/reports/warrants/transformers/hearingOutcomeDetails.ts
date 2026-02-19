import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import { aggregateOutcome } from "./aggregateOutcome"
import { calculateBailStatus } from "./calculateBailStatus"
import { calculateWarrantType } from "./calculateWarrantType"

export interface HearingOutcomeDetails {
  bailStatus: string
  nextCourtDate: string
  nextCourtName: string
  offenceTitles: string
  offenceWordings: string
  warrantText: string
  warrantType: string
}

export const hearingOutcomeDetails = (
  aho: AnnotatedHearingOutcome,
  tRPR0012Present: boolean,
  tRPR0002Present: boolean
): HearingOutcomeDetails => {
  const offences = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence

  // 1. Extract Per-Offence Strings (Map)
  const offenceTitles = offences.map((o) => o.OffenceTitle ?? "Unavailable")
  const offenceWordings = offences.map((o) => o.ActualOffenceWording ?? "Unavailable")

  // 2. Flatten Results
  const allResults = offences.flatMap((o) => o.Result ?? [])

  // 3. Aggregate All Data
  const outcome = aggregateOutcome(allResults)

  // 4. Calculate Derived Statuses
  const warrantType = calculateWarrantType({
    tRPR0002Present,
    tRPR0012Present,
    ...outcome.flags // Spreads parentResult, witnessResult, etc.
  })

  const bailStatus = calculateBailStatus({
    bail: outcome.flags.bail,
    hasNextCourtAppearance: outcome.nextHearings.length > 0,
    noBail: outcome.flags.noBail,
    tRPR0002Present,
    tRPR0012Present
  })

  // 5. Construct Final Text Block
  const warrantText = [outcome.withdrawnResultText, outcome.warrantResultText]
    .filter((text): text is string => !!text)
    .join("\n")

  return {
    bailStatus,
    nextCourtDate: outcome.nextHearings.map((h) => h.date ?? "Unavailable").join(" "),
    nextCourtName: outcome.nextHearings.map((h) => h.courtName ?? "Unavailable").join(" "),
    offenceTitles: offenceTitles.join("\n"),
    offenceWordings: offenceWordings.join("\n"),
    warrantText,
    warrantType
  }
}
