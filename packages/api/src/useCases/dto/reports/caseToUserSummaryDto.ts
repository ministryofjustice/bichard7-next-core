import type { UserSummaryPerformanceDto } from "@moj-bichard7/common/types/reports/UsersSummaryPerformance"

import type { UserSummaryRow } from "../../../types/reports/UserSummary"

export const caseToUserSummaryDto = (row: UserSummaryRow): UserSummaryPerformanceDto => ({
  exceptionsResolved: Number(row.exceptions_resolved),
  fullName: row.full_name || "Unknown User",
  id: Number(row.user_id),
  totalNumberStillLocked: Number(row.total_locked),
  triggerResolved: Number(row.triggers_resolved),
  username: row.username
})
