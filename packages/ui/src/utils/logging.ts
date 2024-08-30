import User from "services/entities/User"
import { CaseListQueryParams } from "types/CaseListQueryParams"
import logger from "./logger"

export const logRenderTime = (
  startTime: number,
  pageName: string,
  params: Record<string, string | number | boolean> = {}
) => {
  const duration = new Date().getTime() - startTime
  logger.info({
    event: "pageRenderTime",
    pageName,
    duration,
    ...params
  })
}

export const logCaseListRenderTime = (startTime: number, user: User, params: CaseListQueryParams) => {
  logRenderTime(startTime, "caseList", {
    forces: user.visibleForces.sort().join("-"),
    caseState: params.caseState ?? "Unresolved",
    reason: params.reason ?? "All",
    maxPageItems: params.maxPageItems ?? 50,
    lockedState: params.lockedState ?? "All"
  })
}
