import { calculateLastPossiblePageNumber } from "./calculateLastPossiblePageNumber"

describe("calculateLastPossiblePageNumber", () => {
  it.each([
    { expected: 1, maxPageItems: 10, totalCases: 10 },
    { expected: 1, maxPageItems: 10, totalCases: 5 },
    { expected: 1, maxPageItems: 25, totalCases: 10 },
    { expected: 1, maxPageItems: 50, totalCases: 10 },
    { expected: 1, maxPageItems: 100, totalCases: 5 },
    { expected: 2, maxPageItems: 10, totalCases: 11 },
    { expected: 3, maxPageItems: 10, totalCases: 26 },
    { expected: 1, maxPageItems: 10, totalCases: 0 }
  ])(
    "calculate the last possible page number when total cases are $totalCases and max page items are $maxPageItems",
    ({ expected, maxPageItems, totalCases }) => {
      expect(calculateLastPossiblePageNumber(totalCases, maxPageItems)).toBe(expected)
    }
  )
})
