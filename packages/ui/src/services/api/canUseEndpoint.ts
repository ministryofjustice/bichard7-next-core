import { FORCES_WITH_API_ENABLED, USE_API, USE_API_CASE_ENDPOINT, USE_API_CASES_INDEX_ENDPOINT } from "config"

export enum ApiEndpoints {
  CaseDetails = "CaseDetails",
  CaseList = "CaseList"
}

export const canUseApiEndpoint = (endpoint: ApiEndpoints, forces: string[]): boolean => {
  if (!USE_API || !forces.some((force) => FORCES_WITH_API_ENABLED.has(force))) {
    return false
  }

  switch (endpoint) {
    case ApiEndpoints.CaseDetails:
      return USE_API_CASE_ENDPOINT
    case ApiEndpoints.CaseList:
      return USE_API_CASES_INDEX_ENDPOINT
    default:
      return false
  }
}
