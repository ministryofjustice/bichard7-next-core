import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import { formatOffenceData } from "../../utils/formatOffenceData"
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
  const formattedOffenceData = formatOffenceData(aho)
  const allResults = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.flatMap(
    (offence) => offence.Result ?? []
  )
  const outcome = aggregateOutcome(allResults)

  const warrantType = calculateWarrantType({
    tRPR0002Present,
    tRPR0012Present,
    ...outcome.flags
  })

  const bailStatus = calculateBailStatus({
    bail: outcome.flags.bail,
    hasNextCourtAppearance: outcome.nextHearings.length > 0,
    noBail: outcome.flags.noBail,
    tRPR0002Present,
    tRPR0012Present
  })

  const warrantText = [outcome.withdrawnResultText, outcome.warrantResultText]
    .filter((text): text is string => !!text)
    .join("\n\n")

  return {
    bailStatus,
    nextCourtDate: formattedOffenceData.nextCourtDates.replaceAll("\n", " "),
    nextCourtName: formattedOffenceData.nextCourtNames.replaceAll("\n", " "),
    offenceTitles: formattedOffenceData.offenceTitles,
    offenceWordings: formattedOffenceData.offenceWordings,
    warrantText,
    warrantType
  }
}
