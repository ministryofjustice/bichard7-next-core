import { ResolutionStatus } from "./ResolutionStatus"

export type UpdateResolutionStatus = {
  errorStatus?: ResolutionStatus
  errorResolvedBy?: string
  errorResolvedTimestamp?: Date
  triggerStatus?: ResolutionStatus
  triggerResolvedBy?: string
  triggerResolvedTimestamp?: Date
  resolutionTimestamp?: Date
}
