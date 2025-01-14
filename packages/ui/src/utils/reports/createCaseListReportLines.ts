import parseAhoXml from "@moj-bichard7/core/lib/parse/parseAhoXml/parseAhoXml"
import { isError } from "lodash"
import type CourtCase from "services/entities/CourtCase"
import type { Report, CaseList } from "./Report"

export const createCaseListReportLines = (courtCases: CourtCase[]): Report<CaseList> => {
  const report = courtCases.map((courtCase) => {
    const aho = parseAhoXml(courtCase.hearingOutcome)

    const reportLine = {
      ASN: courtCase.asn,
      PTIURN: courtCase.ptiurn,
      defendantName: courtCase.defendantName,
      courtName: courtCase.courtName,
      hearingDate: "",
      caseReference: "",
      notes: courtCase.notes.map((note) => `${note.user}: ${note.noteText}`)
    }

    if (!isError(aho)) {
      reportLine.hearingDate = aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.DateOfHearing.toISOString() || ""
      reportLine.caseReference = aho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtCaseReferenceNumber || ""
    }

    return reportLine
  })

  return { report }
}
