import type { ApiEndpointValue } from "../types"
import { CANARY_RATIOS } from "./canaryConfig"
import { normalizeEmail, hashToRatio } from "./createHash"

export const canaryCheck = (endpoint: ApiEndpointValue, userEmail: string): boolean => {
  const canaryRatio = CANARY_RATIOS[endpoint] ?? 0

  if (canaryRatio >= 1) {
    return true
  }

  if (canaryRatio <= 0) {
    return false
  }

  const normalized = normalizeEmail(userEmail)
  const hashInput = `${endpoint}:${normalized}`
  const userRatio = hashToRatio(hashInput)

  return userRatio < canaryRatio
}
