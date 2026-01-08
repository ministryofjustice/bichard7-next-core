import { USE_API_CASE_CANARY_RATIO, USE_API_CASES_INDEX_CANARY_RATIO, USE_API_CASE_RESUBMIT_CANARY_RATIO } from "config"
import type { ApiEndpointValue } from "services/api/types"
import { ApiEndpoints } from "services/api/types"

export const CANARY_RATIOS: Record<ApiEndpointValue, number> = {
  [ApiEndpoints.CaseDetails]: USE_API_CASE_CANARY_RATIO,
  [ApiEndpoints.CaseList]: USE_API_CASES_INDEX_CANARY_RATIO,
  [ApiEndpoints.CaseResubmit]: USE_API_CASE_RESUBMIT_CANARY_RATIO
}
