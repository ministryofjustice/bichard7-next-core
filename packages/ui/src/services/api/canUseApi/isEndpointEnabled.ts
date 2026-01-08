import type { ApiEndpointValue } from "services/api/types"
import { ApiEndpoints } from "services/api/types"
import { USE_API_CASE_ENDPOINT, USE_API_CASES_INDEX_ENDPOINT, USE_API_CASE_RESUBMIT_ENDPOINT } from "config"

export const isEndpointEnabled = (endpoint: ApiEndpointValue): boolean => {
  switch (endpoint) {
    case ApiEndpoints.CaseDetails:
      return USE_API_CASE_ENDPOINT
    case ApiEndpoints.CaseList:
      return USE_API_CASES_INDEX_ENDPOINT
    case ApiEndpoints.CaseResubmit:
      return USE_API_CASE_RESUBMIT_ENDPOINT
    default:
      return false
  }
}
