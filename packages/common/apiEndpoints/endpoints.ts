export const Endpoints = {
  AuditLog: "/audit-logs/:correlationId",
  AuditLogEvents: "/audit-logs/:correlationId/events",
  AuditLogs: "/audit-logs",
  Case: "/cases/:caseId",
  CaseAudit: "/cases/:caseId/audit",
  CaseResubmit: "/cases/:caseId/resubmit",
  Cases: "/cases",
  CasesReportsExceptions: "/cases/reports/exceptions",
  CasesResubmit: "/cases/resubmit",
  Health: "/health",
  Me: "/me"
} as const
