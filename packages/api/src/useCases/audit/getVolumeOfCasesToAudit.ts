import type { CasesToAuditByUser } from "../../types/CasesToAuditByUser"

export function getVolumeOfCasesToAudit(casesToAuditByUser: CasesToAuditByUser[], volume: number): number[] {
  const caseIds = casesToAuditByUser.flatMap(({ caseIds }) => {
    const numberOfCases = Math.ceil(caseIds.length * (volume / 100))
    return caseIds.slice(0, numberOfCases)
  })

  return [...new Set(caseIds)]
}
