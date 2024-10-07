import { subDays } from "date-fns"
import MockDate from "mockdate"
import { mapCaseAges } from "./validateCaseAges"

describe("mapCaseAges", () => {
  afterEach(() => {
    MockDate.reset()
  })

  it("Should return a date range for 'Today'", () => {
    const dateToday = new Date("2022-11-15T12:30")
    MockDate.set(dateToday)

    const result = mapCaseAges("Today")
    expect(result).toEqual([{ from: dateToday, to: dateToday }])
  })

  it("Should return a date range for 'Yesterday'", () => {
    const dateToday = new Date("2022-11-15T12:30")
    const dateYesterday = subDays(dateToday, 1)
    MockDate.set(dateToday)

    const result = mapCaseAges("Yesterday")
    expect(result).toEqual([{ from: dateYesterday, to: dateYesterday }])
  })

  it("Should return a date range for '2 days ago'", () => {
    const dateToday = new Date("2022-11-15T12:30")
    const dateDay2 = subDays(dateToday, 2)

    MockDate.set(dateToday)

    const result = mapCaseAges("2 days ago")
    expect(result).toEqual([{ from: dateDay2, to: dateDay2 }])
  })

  it("Should return a date range for '3 days ago'", () => {
    const dateToday = new Date("2022-11-15T12:30")
    const dateDay3 = subDays(dateToday, 3)

    MockDate.set(dateToday)

    const result = mapCaseAges("3 days ago")
    expect(result).toEqual([{ from: dateDay3, to: dateDay3 }])
  })

  it("Should return undefined for an invalid key", () => {
    expect(mapCaseAges("Invalid date range key")).toBeUndefined()
  })

  it("Should return a date range for multiple keys", () => {
    const dateToday = new Date("2022-11-15T12:30")
    const dateDay2 = subDays(dateToday, 2)

    MockDate.set(dateToday)

    const result = mapCaseAges(["Today", "2 days ago", "Should ignore invalid key"])
    expect(result).toEqual([
      { from: dateToday, to: dateToday },
      { from: dateDay2, to: dateDay2 }
    ])
  })

  it("Should return undefined for an invalid key", () => {
    expect(mapCaseAges(["invalid key"])).toBeUndefined()
    expect(mapCaseAges("invalid key")).toBeUndefined()
  })
})
