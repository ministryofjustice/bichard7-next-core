import type { CasesToAuditByUser } from "../../types/CasesToAuditByUser"

export function getVolumeOfCasesToAudit(casesToAuditByUser: CasesToAuditByUser[], volume: number): number[] {
  return casesToAuditByUser.flatMap((user) => user.caseIds)
}
