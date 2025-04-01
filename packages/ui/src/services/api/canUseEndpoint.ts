import { USE_API, USE_API_CASE_ENDPOINT, USE_API_CASES_INDEX_ENDPOINT } from "config"

export enum ApiEndpoints {
  CaseDetails = "CaseDetails",
  CaseList = "CaseList"
}

export const canUseApiEndpoint = (endpoint: ApiEndpoints): boolean => {
  if (!USE_API) {
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
