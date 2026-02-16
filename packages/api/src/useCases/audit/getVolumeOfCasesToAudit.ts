import type { CasesToAuditByUser } from "../../types/CasesToAuditByUser"

export function getVolumeOfCasesToAudit(casesToAuditByUser: CasesToAuditByUser[], volume: number): number[] {
  const caseIds = casesToAuditByUser.flatMap(({ cases }) => {
    const numberOfCases = Math.ceil(cases.length * (volume / 100))
    return cases
      .sort((a, b) => {
        if (a.audited === b.audited) {
          return a.id - b.id
        }

        return a.audited ? -1 : 1
      })
      .slice(0, numberOfCases)
      .map((row) => row.id)
  })

  return [...new Set(caseIds)]
}
