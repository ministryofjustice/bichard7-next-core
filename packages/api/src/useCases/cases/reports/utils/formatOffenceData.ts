import type { OrganisationUnit } from "@moj-bichard7-developers/bichard7-next-data/dist/types/types"
import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import searchCourtOrganisationUnits from "@moj-bichard7/common/utils/searchCourtOrganisationUnits"

import { formatDate } from "./formatDate"

export interface EnrichedOffenceData {
  nextCourtDates: string
  nextCourtNames: string
  nextCourtTimes: string
  offenceTitles: string
  offenceWordings: string
}

const UNAVAILABLE = "Unavailable"

const getFullOrganisationName = (organisationUnit: OrganisationUnit) =>
  [
    organisationUnit.topLevelName,
    organisationUnit.secondLevelName,
    organisationUnit.thirdLevelName,
    organisationUnit.bottomLevelName
  ]
    .filter((part) => !!part)
    .join(" ")

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

      const organisationUnit = searchCourtOrganisationUnits(ouCode)[0]
      const courtName = getFullOrganisationName(organisationUnit)

      const dateRaw = result.NextHearingDate
      const time = result.NextHearingTime ?? UNAVAILABLE
      const date = formatDate(dateRaw) || UNAVAILABLE

      const uniqueKey = `${ouCode.substring(0, 5)}|${date}|${time}`

      if (!uniqueCourts.has(uniqueKey)) {
        uniqueCourts.add(uniqueKey)
        nextNames.push(courtName)
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
