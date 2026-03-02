export const generateUrlSearchParams = (queryObject: Record<string, unknown>): URLSearchParams => {
  const urlSearchParams = new URLSearchParams()

  if (!queryObject) {
    return urlSearchParams
  }

  Object.entries(queryObject).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return
    }

    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v !== undefined && v !== null) {
          urlSearchParams.append(key, String(v))
        }
      })
    } else if (value instanceof Date) {
      urlSearchParams.append(key, value.toISOString().split("T")[0])
    } else {
      urlSearchParams.append(key, String(value))
    }
  })

  return urlSearchParams
}
