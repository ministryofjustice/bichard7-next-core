import { calculateLastPossiblePageNumber } from "./calculateLastPossiblePageNumber"

describe("calculateLastPossiblePageNumber", () => {
  it.each([
    { totalCases: 10, maxPageItems: 10, expected: 1 },
    { totalCases: 5, maxPageItems: 10, expected: 1 },
    { totalCases: 10, maxPageItems: 25, expected: 1 },
    { totalCases: 10, maxPageItems: 50, expected: 1 },
    { totalCases: 5, maxPageItems: 100, expected: 1 },
    { totalCases: 11, maxPageItems: 10, expected: 2 },
    { totalCases: 26, maxPageItems: 10, expected: 3 },
    { totalCases: 0, maxPageItems: 10, expected: 1 }
  ])(
    "calculate the last possible page number when total cases are $totalCases and max page items are $maxPageItems",
    ({ totalCases, maxPageItems, expected }) => {
      expect(calculateLastPossiblePageNumber(totalCases, maxPageItems)).toBe(expected)
    }
  )
})
