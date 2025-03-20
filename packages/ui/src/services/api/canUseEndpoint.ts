import { USE_API, USE_API_CASE_ENDPOINT, USE_API_CASES_INDEX_ENDPOINT } from "config"

export const canUseApiEndpoint = (endpoint: boolean): boolean => {
  if (!USE_API) {
    return false
  }

  switch (endpoint) {
    case USE_API_CASE_ENDPOINT:
      return true
    case USE_API_CASES_INDEX_ENDPOINT:
      return true
    default:
      return false
  }
}
