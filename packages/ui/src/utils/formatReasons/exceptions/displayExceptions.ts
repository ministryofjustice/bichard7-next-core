import { ResolutionStatus } from "@moj-bichard7/common/types/ApiCaseQuery"

export const displayExceptions = (errorStatus: string | null, state?: string | string[]): boolean =>
  (state === ResolutionStatus.Resolved && errorStatus === ResolutionStatus.Resolved) ||
  errorStatus === ResolutionStatus.Unresolved
