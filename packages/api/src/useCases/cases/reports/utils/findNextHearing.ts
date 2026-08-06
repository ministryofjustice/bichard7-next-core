import type { Result } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import lookupOrganisationUnitByCode from "@moj-bichard7/common/aho/dataLookup/lookupOrganisationUnitByCode"
import { getFullOrganisationName } from "@moj-bichard7/common/utils/searchCourtOrganisationUnits"

import { formatDate } from "./formatDate"

export interface NextHearingDetails {
  courtName: null | string
  date: null | string
  time: null | string
  uniqueKey: string
}

const UNAVAILABLE = "Unavailable"

export const findNextHearing = (result: Result): NextHearingDetails | null => {
  const nextOrg = result.NextResultSourceOrganisation

  if (!nextOrg?.OrganisationUnitCode) {
    return null
  }

  let courtName = nextOrg.OrganisationUnitCode

  const organisationUnit = lookupOrganisationUnitByCode(nextOrg)

  if (organisationUnit) {
    courtName = getFullOrganisationName(organisationUnit)
  }

  const dateRaw = result.NextHearingDate
  const time = result.NextHearingTime ?? UNAVAILABLE
  const dateFormatted = formatDate(dateRaw) || UNAVAILABLE
  const uniqueKey = `${courtName}${dateRaw ? new Date(dateRaw).toISOString() : ""}${time}`

  return {
    courtName,
    date: dateFormatted,
    time,
    uniqueKey
  }
}
