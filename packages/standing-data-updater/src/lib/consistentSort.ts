import lodash from "lodash"
import { sortJsonKeys } from "sort-json-keys"

export const consistentSort = (input: object[]): object[] => {
  if (input.length === 0) {
    return []
  }

  const keys = Object.keys(input[0]).sort()
  const newData = lodash.sortBy(input, keys)
  return sortJsonKeys(newData)
}
