import type { Audit, AuditDto, AuditWithProgress, AuditWithProgressDto } from "@moj-bichard7/common/types/Audit"

import { format } from "date-fns"

export const convertAuditToDto = (audit: Audit): AuditDto => {
  return {
    auditId: audit.audit_id,
    completedWhen: audit.completed_when?.toISOString() ?? null,
    createdBy: audit.created_by,
    createdWhen: audit.created_when.toISOString(),
    fromDate: format(audit.from_date, "yyyy-MM-dd"),
    includedTypes: audit.included_types,
    resolvedByUsers: audit.resolved_by_users,
    toDate: format(audit.to_date, "yyyy-MM-dd"),
    triggerTypes: audit.trigger_types,
    volumeOfCases: audit.volume_of_cases
  }
}

export const convertAuditWithProgressToDto = (audit: AuditWithProgress): AuditWithProgressDto => {
  return {
    ...convertAuditToDto(audit),
    auditedCases: audit.audited_cases,
    totalCases: audit.total_cases
  }
}
