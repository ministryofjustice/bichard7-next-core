import parseAhoXml from "@moj-bichard7/core/lib/parse/parseAhoXml/parseAhoXml"
import { isError } from "lodash"
import type CourtCase from "services/entities/CourtCase"
import type { Report, ResolvedException } from "./Report"

export const createResolvedExceptionsReportLines = (courtCases: CourtCase[]): Report<ResolvedException> => {
  const report = courtCases.map((courtCase) => {
    const aho = parseAhoXml(courtCase.hearingOutcome)

    const reportLine = {
      ASN: courtCase.asn,
      PTIURN: courtCase.ptiurn,
      defendantName: courtCase.defendantName,
      courtName: courtCase.courtName,
      hearingDate: "",
      caseReference: "",
      dateTimeRecievedByCJSE: courtCase.messageReceivedTimestamp?.toISOString() || "",
      dateTimeResolved: courtCase.resolutionTimestamp?.toISOString() || "",
      notes: courtCase.notes.map((note) => `${note.user}: ${note.noteText}`),
      resolutionAction:
        courtCase.notes.sort((a, b) => a.createdAt.valueOf() - b.createdAt.valueOf()).pop()?.noteText || ""
    }

    if (!isError(aho)) {
      reportLine.hearingDate = aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.DateOfHearing.toISOString() || ""
      reportLine.caseReference = aho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtCaseReferenceNumber || ""
    }

    return reportLine
  })

  return { report }
}
