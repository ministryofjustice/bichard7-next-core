const deepSort = <T>(obj: T): T => {
  if (obj === null || typeof obj !== "object") {
    return obj
  }

  if (Array.isArray(obj)) {
    const recursed = obj.map(deepSort)
    return recursed.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b))) as T
  }

  return Object.keys(obj)
    .sort()
    .reduce(
      (acc, key) => {
        acc[key] = deepSort((obj as Record<string, unknown>)[key])
        return acc
      },
      {} as Record<string, unknown>
    ) as T
}

export default deepSort
