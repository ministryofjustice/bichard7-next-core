import { subDays } from "date-fns"
import { CourtDateRange } from "types/CaseListQueryParams"

export const CaseAgeOptions: Record<string, () => CourtDateRange> = {
  Today: () => {
    const today = new Date()
    return { from: today, to: today }
  },
  Yesterday: () => {
    const yesterday = subDays(new Date(), 1)
    return { from: yesterday, to: yesterday }
  },
  "2 days ago": () => {
    const day2 = subDays(new Date(), 2)
    return { from: day2, to: day2 }
  },
  "3 days ago": () => {
    const day3 = subDays(new Date(), 3)
    return { from: day3, to: day3 }
  },
  "4 days ago": () => {
    const day4 = subDays(new Date(), 4)
    return { from: day4, to: day4 }
  },
  "5 days ago": () => {
    const day5 = subDays(new Date(), 5)
    return { from: day5, to: day5 }
  },
  "6 days ago": () => {
    const day6 = subDays(new Date(), 6)
    return { from: day6, to: day6 }
  },
  "7 days ago": () => {
    const day7 = subDays(new Date(), 7)
    return { from: day7, to: day7 }
  },
  "8 days ago": () => {
    const day8 = subDays(new Date(), 8)
    return { from: day8, to: day8 }
  },
  "9 days ago": () => {
    const day9 = subDays(new Date(), 9)
    return { from: day9, to: day9 }
  },
  "10 days ago": () => {
    const day10 = subDays(new Date(), 10)
    return { from: day10, to: day10 }
  },
  "11 days ago": () => {
    const day11 = subDays(new Date(), 11)
    return { from: day11, to: day11 }
  },
  "12 days ago": () => {
    const day12 = subDays(new Date(), 12)
    return { from: day12, to: day12 }
  },
  "13 days ago": () => {
    const day13 = subDays(new Date(), 13)
    return { from: day13, to: day13 }
  },
  "14 days ago": () => {
    const day14 = subDays(new Date(), 14)
    return { from: day14, to: day14 }
  },
  "15 days ago and older": () => {
    const unixEpoch = new Date(0)
    const day15 = subDays(new Date(), 15)
    return { from: unixEpoch, to: day15 }
  }
}
