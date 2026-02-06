import type { CasesToAuditByUser } from "../../types/CasesToAuditByUser"

import { getVolumeOfCasesToAudit } from "./getVolumeOfCasesToAudit"

describe("getVolumeOfCasesToAudit", () => {
  it("gets all cases for 100% volume", () => {
    const casesToAuditByUser: CasesToAuditByUser[] = [
      {
        caseIds: [1, 2, 3],
        username: "user@example.com"
      }
    ]

    const caseIds = getVolumeOfCasesToAudit(casesToAuditByUser, 100)

    expect(caseIds).toStrictEqual([1, 2, 3])
  })

  it("should round up number cases to nearest whole number", () => {
    const casesToAuditByUser: CasesToAuditByUser[] = [
      {
        caseIds: [1, 2, 3],
        username: "user@example.com"
      }
    ]

    const caseIds = getVolumeOfCasesToAudit(casesToAuditByUser, 50)

    expect(caseIds).toStrictEqual([1, 2])
  })

  it("removes duplicate case IDs", () => {
    const casesToAuditByUser: CasesToAuditByUser[] = [
      {
        caseIds: [1, 2, 3],
        username: "user@example.com"
      },
      {
        caseIds: [2, 3, 4],
        username: "user2@example.com"
      }
    ]

    const caseIds = getVolumeOfCasesToAudit(casesToAuditByUser, 100)

    expect(caseIds).toStrictEqual([1, 2, 3, 4])
  })
})
