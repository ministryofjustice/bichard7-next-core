import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import { formatDate } from "./formatDate"

export interface EnrichedOffenceData {
  nextCourtDates: string
  nextCourtNames: string
  nextCourtTimes: string
  offenceTitles: string
  offenceWordings: string
}

const UNAVAILABLE = "Unavailable"

export const formatOffenceData = (aho: AnnotatedHearingOutcome): EnrichedOffenceData => {
  const offences = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence ?? []

  const offenceCounts = new Map<string, number>()
  const uniqueCourts = new Set<string>()

  const wordings: string[] = []
  const nextNames: string[] = []
  const nextDates: string[] = []
  const nextTimes: string[] = []

  for (const offence of offences) {
    const title = offence.OffenceTitle ?? UNAVAILABLE
    offenceCounts.set(title, (offenceCounts.get(title) || 0) + 1)
    wordings.push(offence.ActualOffenceWording ?? UNAVAILABLE)

    const results = offence.Result.filter((r) => r.NextResultSourceOrganisation?.OrganisationUnitCode)
    for (const result of results) {
      const ouCode = result.NextResultSourceOrganisation?.OrganisationUnitCode ?? ""
      const dateRaw = result.NextHearingDate
      const time = result.NextHearingTime ?? UNAVAILABLE
      const date = formatDate(dateRaw) || UNAVAILABLE

      const uniqueKey = `${ouCode.substring(0, 5)}|${date}|${time}`

      if (!uniqueCourts.has(uniqueKey)) {
        uniqueCourts.add(uniqueKey)
        nextNames.push(ouCode)
        nextDates.push(date)
        nextTimes.push(time)
      }
    }
  }

  const formattedTitles = Array.from(offenceCounts.entries()).map(([title, count]) =>
    count === 1 ? `${title}.` : `${count}× ${title}.`
  )

  return {
    nextCourtDates: nextDates.join("\n\n"),
    nextCourtNames: nextNames.join("\n\n"),
    nextCourtTimes: nextTimes.join("\n\n"),
    offenceTitles: formattedTitles.join("\n\n"),
    offenceWordings: wordings.join("\n\n")
  }
}
