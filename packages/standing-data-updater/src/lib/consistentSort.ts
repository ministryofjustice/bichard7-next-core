import { sortJsonKeys } from "sort-json-keys"

export const consistentSort = (input: object[]): object[] => {
  if (input.length === 0) {
    return []
  }

  const keys = Object.keys(input[0]).sort()
  const newData = [...input].sort((a, b) => {
    for (const key of keys) {
      const valA = (a as Record<string, unknown>)[key]
      const valB = (b as Record<string, unknown>)[key]

      if (valA === valB) {
        continue
      }

      if (valA == null) {
        return 1
      }

      if (valB == null) {
        return -1
      }

      if (typeof valA === "string" && typeof valB === "string") {
        const cmp = valA.localeCompare(valB)
        if (cmp !== 0) {
          return cmp
        }
      } else {
        if (valA < valB) {
          return -1
        }

        if (valA > valB) {
          return 1
        }
      }
    }

    return 0
  })

  return sortJsonKeys(newData)
}
