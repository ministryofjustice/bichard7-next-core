import { USE_API } from "config"
import type { ApiEndpointValue } from "../types"
import { canaryCheck } from "./canaryCheck"
import { hasApiEnabledByForce } from "./hasApiEnabledByForce"
import { isEndpointEnabled } from "./isEndpointEnabled"

export const canUseApiEndpoint = (endpoint: ApiEndpointValue, visibleForces: string[], userEmail: string): boolean => {
  if (!USE_API) {
    return false
  }

  if (!hasApiEnabledByForce(visibleForces)) {
    return false
  }

  if (!isEndpointEnabled(endpoint)) {
    return false
  }

  return canaryCheck(endpoint, userEmail)
}
