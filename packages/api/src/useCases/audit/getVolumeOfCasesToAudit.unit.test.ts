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

    expect(caseIds).toStrictEqual(casesToAuditByUser[0].caseIds)
  })
})
