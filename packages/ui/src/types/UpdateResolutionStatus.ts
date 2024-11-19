import type { ResolutionStatus } from "./ResolutionStatus"

export type UpdateResolutionStatus = {
  errorResolvedBy?: string
  errorResolvedTimestamp?: Date
  errorStatus?: ResolutionStatus
  resolutionTimestamp?: Date
  triggerResolvedBy?: string
  triggerResolvedTimestamp?: Date
  triggerStatus?: ResolutionStatus
}
