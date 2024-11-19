import type CourtCase from "services/entities/CourtCase"

import fs from "fs"

import type { Report, ResolvedException } from "./Report"

import generateAho from "../../../test/helpers/generateAho"
import { createResolvedExceptionsReportLines } from "./createResolvedExceptionsReportLines"

describe("resolvedExceptionsReport", () => {
  it("returns a list of resolved exceptions", () => {
    const ahoXml = fs.readFileSync("test/test-data/AnnotatedHOTemplate.xml").toString()
    const date = new Date()
    const courtCases = [
      {
        asn: "asn",
        courtCode: "court-code",
        courtName: "court-name",
        defendantName: "defendant-name",
        errorId: 1,
        errorLockedByUserFullName: "error-locked-by-user-full-name",
        errorLockedByUsername: "error-locked-by-user-name",
        errorReport: "error-report",
        errorStatus: "Resolved",
        hearingOutcome: generateAho({
          ahoTemplate: ahoXml,
          courtName: "court-name",
          firstName: "first-name",
          lastName: "last-name",
          ptiurn: "ptirun"
        }),
        isUrgent: false,
        messageReceivedTimestamp: date,
        notes: [
          {
            createdAt: new Date("21-2-2024"),
            noteText: "note text",
            user: "user"
          },
          {
            createdAt: new Date("21-3-2024"),
            noteText: "resolved text",
            user: "user2"
          }
        ],
        ptiurn: "ptiurn",
        resolutionTimestamp: date,
        triggerCount: 1
      }
    ] as unknown as CourtCase[]

    const result = createResolvedExceptionsReportLines(courtCases)

    expect(result).toEqual({
      report: [
        {
          ASN: "asn",
          caseReference: "97/1626/008395Q",
          courtName: "court-name",
          dateTimeRecievedByCJSE: date.toISOString(),
          dateTimeResolved: date.toISOString(),
          defendantName: "defendant-name",
          hearingDate: "2011-09-26T00:00:00.000Z",
          notes: ["user: note text", "user2: resolved text"],
          PTIURN: "ptiurn",
          resolutionAction: "resolved text"
        }
      ]
    } as Report<ResolvedException>)
  })
})
