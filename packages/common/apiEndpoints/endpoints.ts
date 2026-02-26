export const Endpoints = {
  Audit: "/audit",
  AuditById: "/audit/:auditId",
  AuditCases: "/audit/:auditId/cases",
  AuditLog: "/audit-logs/:correlationId",
  AuditLogEvents: "/audit-logs/:correlationId/events",
  AuditLogs: "/audit-logs",
  Case: "/cases/:caseId",
  CaseAudit: "/cases/:caseId/audit",
  CaseResubmit: "/cases/:caseId/resubmit",
  Cases: "/cases",
  CasesReportsBails: "/cases/reports/bails",
  CasesReportsDomesticViolence: "/cases/reports/domestic-violence",
  CasesReportsExceptions: "/cases/reports/exceptions",
  CasesReportsWarrants: "/cases/reports/warrants",
  CasesResubmit: "/cases/resubmit",
  Health: "/health",
  Me: "/me"
} as const
