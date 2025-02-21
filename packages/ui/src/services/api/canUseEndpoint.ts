import { USE_API, USE_API_CASE_ENDPOINT } from "config"

export const canUseApiEndpoint = (endpoint: boolean): boolean => {
  if (!USE_API) {
    return false
  }

  if (endpoint === USE_API_CASE_ENDPOINT) {
    return true
  }

  return false
}
