import type User from "services/entities/User"
import type { CaseListQueryParams } from "types/CaseListQueryParams"

import logger from "./logger"

export const logRenderTime = (
  startTime: number,
  pageName: string,
  params: Record<string, boolean | number | string> = {}
) => {
  const duration = new Date().getTime() - startTime
  logger.info({
    duration,
    event: "pageRenderTime",
    pageName,
    ...params
  })
}

export const logCaseListRenderTime = (startTime: number, user: User, params: CaseListQueryParams) => {
  logRenderTime(startTime, "caseList", {
    caseState: params.caseState ?? "Unresolved",
    forces: user.visibleForces.sort().join("-"),
    lockedState: params.lockedState ?? "All",
    maxPageItems: params.maxPageItems ?? 50,
    reason: params.reason ?? "All"
  })
}
