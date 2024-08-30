import defaults from "defaults"

export const calculateLastPossiblePageNumber = (totalCases: number, maxPageItems = defaults.maxPageItems): number =>
  Math.ceil(totalCases / maxPageItems) || 1
