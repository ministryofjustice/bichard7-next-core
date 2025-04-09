import type { ApiCaseQuery } from "@moj-bichard7/common/types/ApiCaseQuery"

export const generateUrlSearchParams = (apiCaseQuery: ApiCaseQuery): URLSearchParams => {
  const urlSearchParams = new URLSearchParams()

  Object.entries(apiCaseQuery).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => urlSearchParams.append(key, String(v)))
    } else {
      if (value instanceof Date) {
        value = value.toISOString().split("T")[0]
      }

      urlSearchParams.append(key, String(value))
    }
  })

  return urlSearchParams
}
