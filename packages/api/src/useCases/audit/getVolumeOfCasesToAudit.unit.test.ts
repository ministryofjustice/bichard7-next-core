import type { CasesToAuditByUser } from "../../types/CasesToAuditByUser"

import { getVolumeOfCasesToAudit } from "./getVolumeOfCasesToAudit"

describe("getVolumeOfCasesToAudit", () => {
  it("gets all cases for 100% volume", () => {
    const casesToAuditByUser: CasesToAuditByUser[] = [
      {
        cases: [
          { audited: false, id: 1 },
          { audited: false, id: 2 },
          { audited: false, id: 3 }
        ],
        username: "user@example.com"
      }
    ]

    const caseIds = getVolumeOfCasesToAudit(casesToAuditByUser, 100)

    expect(caseIds).toStrictEqual([1, 2, 3])
  })

  it("should round up number cases to nearest whole number", () => {
    const casesToAuditByUser: CasesToAuditByUser[] = [
      {
        cases: [
          { audited: false, id: 1 },
          { audited: false, id: 2 },
          { audited: false, id: 3 }
        ],
        username: "user@example.com"
      }
    ]

    const caseIds = getVolumeOfCasesToAudit(casesToAuditByUser, 50)

    expect(caseIds).toStrictEqual([1, 2])
  })

  it("removes duplicate case IDs", () => {
    const casesToAuditByUser: CasesToAuditByUser[] = [
      {
        cases: [
          { audited: false, id: 1 },
          { audited: false, id: 2 },
          { audited: false, id: 3 }
        ],
        username: "user@example.com"
      },
      {
        cases: [
          { audited: false, id: 2 },
          { audited: false, id: 3 },
          { audited: false, id: 4 }
        ],
        username: "user2@example.com"
      }
    ]

    const caseIds = getVolumeOfCasesToAudit(casesToAuditByUser, 100)

    expect(caseIds).toStrictEqual([1, 2, 3, 4])
  })

  it("should use cases already audited first", () => {
    const casesToAuditByUser: CasesToAuditByUser[] = [
      {
        cases: [
          { audited: false, id: 1 },
          { audited: false, id: 2 },
          { audited: true, id: 3 },
          { audited: false, id: 4 }
        ],
        username: "user@example.com"
      },
      {
        cases: [
          { audited: false, id: 5 },
          { audited: false, id: 6 },
          { audited: true, id: 7 },
          { audited: false, id: 8 }
        ],
        username: "user2@example.com"
      }
    ]

    const caseIds = getVolumeOfCasesToAudit(casesToAuditByUser, 50)

    expect(caseIds).toStrictEqual([3, 1, 7, 5])
  })
})
