import type { UserForPerformanceSummaryDto } from "@moj-bichard7/common/types/reports/UserPerformanceSummary"

import type { UserSummaryRow } from "../../../types/reports/UserSummary"

export const convertRowToUserPerformanceSummaryDto = (row: UserSummaryRow): UserForPerformanceSummaryDto => ({
  exceptionsResolved: Number(row.exceptions_resolved),
  fullName: row.full_name || "Unknown User",
  id: Number(row.user_id),
  totalNumberStillLocked: Number(row.total_locked),
  triggerResolved: Number(row.triggers_resolved),
  username: row.username
})
