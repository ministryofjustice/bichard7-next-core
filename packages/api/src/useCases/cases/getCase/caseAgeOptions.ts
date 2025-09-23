/* eslint-disable perfectionist/sort-objects */
import type { DateRange } from "@moj-bichard7/common/types/DateRange"

import { CaseAge } from "@moj-bichard7/common/types/CaseAge"
import { subDays } from "date-fns"

const dateHelper = (days: number): Date => subDays(new Date(), days)

const formatDateRange = (date: Date): DateRange => {
  return { from: date, to: date }
}

export const CaseAgeOptions: Record<string, () => DateRange> = {
  [CaseAge.Today]: () => {
    const today = new Date()
    return formatDateRange(today)
  },
  [CaseAge.Yesterday]: () => {
    return formatDateRange(dateHelper(1))
  },
  [CaseAge.TwoDaysAgo]: () => {
    return formatDateRange(dateHelper(2))
  },
  [CaseAge.ThreeDaysAgo]: () => {
    return formatDateRange(dateHelper(3))
  },
  [CaseAge.FourDaysAgo]: () => {
    return formatDateRange(dateHelper(4))
  },
  [CaseAge.FiveDaysAgo]: () => {
    return formatDateRange(dateHelper(5))
  },
  [CaseAge.SixDaysAgo]: () => {
    return formatDateRange(dateHelper(6))
  },
  [CaseAge.SevenDaysAgo]: () => {
    return formatDateRange(dateHelper(7))
  },
  [CaseAge.EightDaysAgo]: () => {
    return formatDateRange(dateHelper(8))
  },
  [CaseAge.NineDaysAgo]: () => {
    return formatDateRange(dateHelper(9))
  },
  [CaseAge.TenDaysAgo]: () => {
    return formatDateRange(dateHelper(10))
  },
  [CaseAge.ElevenDaysAgo]: () => {
    return formatDateRange(dateHelper(11))
  },
  [CaseAge.TwelveDaysAgo]: () => {
    return formatDateRange(dateHelper(12))
  },
  [CaseAge.ThirteenDaysAgo]: () => {
    return formatDateRange(dateHelper(13))
  },
  [CaseAge.FourteenDaysAgo]: () => {
    return formatDateRange(dateHelper(14))
  },
  [CaseAge.FifteenDaysAgoAndOlder]: () => {
    const unixEpoch = new Date(0)
    const day15 = dateHelper(15)
    return { from: unixEpoch, to: day15 }
  }
}
