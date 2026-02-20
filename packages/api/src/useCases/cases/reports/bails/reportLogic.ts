import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import { ResolutionStatus, ResolutionStatusNumber } from "@moj-bichard7/common/types/ResolutionStatus"
import { differenceInCalendarDays, format } from "date-fns"

// --- Constants & Types ---
const UNAVAILABLE = "Unavailable"
const NO_BAIL_CONDITIONS_TEXT = "noBailConditionsText" // Matches legacy property file key

export interface OffenceAggregation {
  nextCourtDates: string
  nextCourtNames: string
  nextCourtTimes: string
  offenceTitles: string
}

// --- Helper: Date Formatting ---
export const formatDate = (date: Date | null | string | undefined): string => {
  if (!date) {
    return ""
  }

  try {
    return format(new Date(date), "dd/MM/yyyy")
  } catch {
    return ""
  }
}

// --- Core Logic Functions ---

/**
 * Replicates Java: getTriggerStatus
 * Maps numeric status codes to string descriptions.
 */
export const getTriggerStatus = (status: number | undefined): string => {
  if (status === ResolutionStatusNumber.Unresolved) {
    return ResolutionStatus.Unresolved
  }

  if (status === ResolutionStatusNumber.Resolved) {
    return ResolutionStatus.Resolved
  }

  if (status === ResolutionStatusNumber.Submitted) {
    return ResolutionStatus.Submitted
  }

  return "Unknown"
}

/**
 * Replicates Java: getNumberOfDaysTakenToEnterPortal
 * Logic:
 * 1. If courtDate > receivedDate -> Return empty string
 * 2. Else -> Return difference in calendar days
 */
export const calculateDaysToEnterPortal = (courtDate: Date | string, receivedDate: Date | string): string => {
  const start = new Date(courtDate)
  const end = new Date(receivedDate)

  // Legacy Rule: Return empty if dates are inverted
  if (start > end) {
    return ""
  }

  return differenceInCalendarDays(end, start).toString()
}

/**
 * Replicates: getHearingTime
 */
export const getHearingTime = (aho: AnnotatedHearingOutcome): string => {
  return aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.TimeOfHearing ?? ""
}

/**
 * Replicates: getDefendantAddress
 * Legacy Logic: Flattens XML address lines into a comma-separated string.
 */
export const getDefendantAddress = (aho: AnnotatedHearingOutcome): string => {
  const address = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Address
  if (!address) {
    return UNAVAILABLE
  }

  const lines = [
    address.AddressLine1,
    address.AddressLine2,
    address.AddressLine3,
    address.AddressLine4,
    address.AddressLine5
  ].filter((line): line is string => !!line)

  return lines.length > 0 ? lines.join(", ") : UNAVAILABLE
}

/**
 * Replicates: getDateOfBirth
 */
export const getDateOfBirth = (aho: AnnotatedHearingOutcome): string => {
  const birthDate = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.DefendantDetail?.BirthDate
  return formatDate(birthDate)
}

/**
 * Replicates: getBailConditionsImposed
 * Legacy Logic: Joins conditions with newlines. Returns specific text if empty.
 */
export const getBailConditionsImposed = (aho: AnnotatedHearingOutcome): string => {
  const conditions = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.BailConditions

  if (!conditions || conditions.length === 0) {
    return NO_BAIL_CONDITIONS_TEXT
  }

  return conditions.join("\n")
}

/**
 * Replicates: getCaseAutomatedToPNC
 * Legacy Logic: Checks error count vs RecordableOnPNCIndicator
 */
export const getCaseAutomatedToPNC = (aho: AnnotatedHearingOutcome, errorCount: number): string => {
  const recordable = aho.AnnotatedHearingOutcome.HearingOutcome.Case.RecordableOnPNCindicator

  if (errorCount >= 1) {
    return "No"
  }

  if (recordable) {
    return "Yes"
  } else {
    return "n/a"
  }
}

/**
 * Replicates both getOffences AND getNextCourtDetails in a single pass.
 * Legacy Logic:
 * 1. Counts duplicate offences ("3x Theft").
 * 2. Aggregates next court appearances, filtering out duplicates based on (OU Code + Date + Time).
 */
export const aggregateOffenceData = (aho: AnnotatedHearingOutcome): OffenceAggregation => {
  const offences = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence ?? []

  // Data Structures
  const offenceCounts = new Map<string, number>()
  const uniqueCourts = new Set<string>()

  const nextCourtNames: string[] = []
  const nextCourtDates: string[] = []
  const nextCourtTimes: string[] = []

  // Single Pass Loop
  for (const offence of offences) {
    // --- Part A: Offence Titles ---
    const title = offence.OffenceTitle ?? UNAVAILABLE
    offenceCounts.set(title, (offenceCounts.get(title) || 0) + 1)

    // --- Part B: Next Court Details ---
    // Only process results that have a NextResultSourceOrganisation (Remands)
    const results = offence.Result.filter((r) => r.NextResultSourceOrganisation?.OrganisationUnitCode)

    for (const result of results) {
      const ouCode = result.NextResultSourceOrganisation?.OrganisationUnitCode ?? ""
      const dateRaw = result.NextHearingDate
      const time = result.NextHearingTime ?? UNAVAILABLE
      const date = formatDate(dateRaw) || UNAVAILABLE

      // Legacy uniqueness key: First 5 chars of OU + Date + Time
      // Java: "truncatedCurrentNextHearingOUCode... append(currentNextHearingDate)..."
      const uniqueKey = `${ouCode.substring(0, 5)}|${date}|${time}`

      if (!uniqueCourts.has(uniqueKey)) {
        uniqueCourts.add(uniqueKey)

        // Use OU Code as name (Legacy behavior often fell back to code if lookup failed)
        // If you have a separate OU lookup service, you would map 'ouCode' here.
        nextCourtNames.push(ouCode)
        nextCourtDates.push(date)
        nextCourtTimes.push(time)
      }
    }
  }

  // Formatting Offence Titles
  const formattedTitles: string[] = []
  offenceCounts.forEach((count, title) => {
    if (count === 1) {
      formattedTitles.push(`${title}.`)
    } else {
      formattedTitles.push(`${count}× ${title}.`) // Using multiplication sign to match legacy
    }
  })

  return {
    nextCourtDates: nextCourtDates.join("\n"),
    nextCourtNames: nextCourtNames.join("\n"),
    nextCourtTimes: nextCourtTimes.join("\n"),
    offenceTitles: formattedTitles.join("\n")
  }
}
