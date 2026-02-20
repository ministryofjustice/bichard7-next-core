import type { Result } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import { formatDate } from "../../utils/formatDate"

export interface NextHearingDetails {
  courtName: null | string
  date: null | string
  time: null | string
  uniqueKey: string
}

export const findNextHearing = (result: Result): NextHearingDetails | null => {
  const nextOrg = result.NextResultSourceOrganisation

  // If no Next Result Source Organisation, it is not a next hearing result
  // Schema property is OrganisationUnitCode
  if (!nextOrg?.OrganisationUnitCode) {
    return null
  }

  const code = nextOrg.OrganisationUnitCode
  const dateRaw = result.NextHearingDate
  const time = result.NextHearingTime ?? ""

  const dateFormatted = formatDate(dateRaw) || "Unavailable"

  // Create a unique key for deduplication logic
  // (Legacy Java logic concatenates OU Code + Date + Time)
  const uniqueKey = `${code}${dateRaw ? new Date(dateRaw).toISOString() : ""}${time}`

  return {
    courtName: code, // In a real app, you might look up the human-readable name here
    date: dateFormatted,
    time: time,
    uniqueKey
  }
}
