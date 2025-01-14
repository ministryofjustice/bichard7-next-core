import fs from "fs"
import generateAho from "../../../test/helpers/generateAho"
import type CourtCase from "services/entities/CourtCase"
import type { CaseList, Report } from "./Report"
import { createCaseListReportLines } from "./createCaseListReportLines"

describe("caseliatReport", () => {
  it("returns a list of cases", () => {
    const ahoXml = fs.readFileSync("test/test-data/AnnotatedHOTemplate.xml").toString()
    const date = new Date()
    const courtCases = [
      {
        asn: "asn",
        ptiurn: "ptiurn",
        triggerCount: 1,
        courtCode: "court-code",
        courtName: "court-name",
        errorId: 1,
        errorReason: "error-reason",
        errorReport: "HO100322||ds:OrganisationUnitCode, HO100323||ds:NextHearingDate, HO100325||br7:ResultClass",
        errorStatus: "Resolved",
        errorLockedByUserFullName: "error-locked-by-user-full-name",
        errorLockedByUsername: "error-locked-by-user-name",
        triggerLockedByFullName: "trigger-locked-by-user-full-name",
        triggerLockedByUsername: "trigger-locked-by-user-name",
        isUrgent: false,
        defendantName: "defendant-name",
        resolutionTimestamp: date,
        messageReceivedTimestamp: date,
        hearingOutcome: generateAho({
          firstName: "first-name",
          lastName: "last-name",
          ahoTemplate: ahoXml,
          ptiurn: "ptirun",
          courtName: "court-name"
        }),
        triggers: [
          {
            triggerCode: "TRPR0001",
            status: "Resolved",
            createdAt: date,
            resolvedBy: "resolved-by",
            resolvedAt: date
          }
        ],
        notes: [
          {
            noteText: "note text",
            userId: "user",
            createdAt: new Date("21-2-2024")
          },
          {
            noteText: "resolved text",
            userId: "user2",
            createdAt: new Date("21-3-2024")
          }
        ]
      }
    ] as unknown as CourtCase[]

    const result = createCaseListReportLines(courtCases)

    expect(result).toEqual({
      report: [
        {
          PTIURN: "ptiurn",
          defendantName: "defendant-name",
          courtName: "court-name",
          courtDate: "2011-09-26T00:00:00.000Z",
          notes: "user: note text\nuser2: resolved text",
          reason: "HO100322\nHO100323\nHO100325\nTRPR0001",
          errorsLockedBy: "error-locked-by-user-name",
          triggersLockedBy: "trigger-locked-by-user-name"
        }
      ]
    } as Report<CaseList>)
  })
})
