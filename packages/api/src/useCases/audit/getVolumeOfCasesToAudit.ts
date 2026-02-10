import type { CasesToAuditByUser } from "../../types/CasesToAuditByUser"

export function getVolumeOfCasesToAudit(casesToAuditByUser: CasesToAuditByUser[], volume: number): number[] {
  const caseIds = casesToAuditByUser.flatMap(({ cases }) => {
    const numberOfCases = Math.ceil(cases.length * (volume / 100))
    return cases.slice(0, numberOfCases).map((row) => row.id)
  })

  return [...new Set(caseIds)]
}
