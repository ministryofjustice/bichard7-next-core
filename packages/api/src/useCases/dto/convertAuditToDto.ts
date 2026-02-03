import type { AuditDto, AuditRow } from "@moj-bichard7/common/types/Audit"

import { format } from "date-fns"

export const convertAuditToDto = (auditRow: AuditRow): AuditDto => {
  return {
    auditId: auditRow.audit_id,
    completedWhen: auditRow.completed_when?.toISOString() ?? null,
    createdBy: auditRow.created_by,
    createdWhen: auditRow.created_when.toISOString(),
    fromDate: format(auditRow.from_date, "yyyy-MM-dd"),
    includedTypes: auditRow.included_types,
    resolvedByUsers: auditRow.resolved_by_users,
    toDate: format(auditRow.to_date, "yyyy-MM-dd"),
    triggerTypes: auditRow.trigger_types,
    volumeOfCases: auditRow.volume_of_cases
  }
}
