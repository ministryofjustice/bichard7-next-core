/* eslint-disable perfectionist/sort-objects */
import type { DateRange } from "@moj-bichard7/common/types/DateRange"

import { CaseAge } from "@moj-bichard7/common/types/CaseAge"
import { subDays } from "date-fns"

export const CaseAgeOptions: Record<string, () => DateRange> = {
  [CaseAge.Today]: () => {
    const today = new Date()
    return { from: today, to: today }
  },
  [CaseAge.Yesterday]: () => {
    const yesterday = subDays(new Date(), 1)
    return { from: yesterday, to: yesterday }
  },
  [CaseAge.TwoDaysAgo]: () => {
    const day2 = subDays(new Date(), 2)
    return { from: day2, to: day2 }
  },
  [CaseAge.ThreeDaysAgo]: () => {
    const day3 = subDays(new Date(), 3)
    return { from: day3, to: day3 }
  },
  [CaseAge.FourDaysAgo]: () => {
    const day4 = subDays(new Date(), 4)
    return { from: day4, to: day4 }
  },
  [CaseAge.FiveDaysAgo]: () => {
    const day5 = subDays(new Date(), 5)
    return { from: day5, to: day5 }
  },
  [CaseAge.SixDaysAgo]: () => {
    const day6 = subDays(new Date(), 6)
    return { from: day6, to: day6 }
  },
  [CaseAge.SevenDaysAgo]: () => {
    const day7 = subDays(new Date(), 7)
    return { from: day7, to: day7 }
  },
  [CaseAge.EightDaysAgo]: () => {
    const day8 = subDays(new Date(), 8)
    return { from: day8, to: day8 }
  },
  [CaseAge.NineDaysAgo]: () => {
    const day9 = subDays(new Date(), 9)
    return { from: day9, to: day9 }
  },
  [CaseAge.TenDaysAgo]: () => {
    const day10 = subDays(new Date(), 10)
    return { from: day10, to: day10 }
  },
  [CaseAge.ElevenDaysAgo]: () => {
    const day11 = subDays(new Date(), 11)
    return { from: day11, to: day11 }
  },
  [CaseAge.TwelveDaysAgo]: () => {
    const day12 = subDays(new Date(), 12)
    return { from: day12, to: day12 }
  },
  [CaseAge.ThirteenDaysAgo]: () => {
    const day13 = subDays(new Date(), 13)
    return { from: day13, to: day13 }
  },
  [CaseAge.FourteenDaysAgo]: () => {
    const day14 = subDays(new Date(), 14)
    return { from: day14, to: day14 }
  },
  [CaseAge.FifteenDaysAgoAndOlder]: () => {
    const unixEpoch = new Date(0)
    const day15 = subDays(new Date(), 15)
    return { from: unixEpoch, to: day15 }
  }
}
