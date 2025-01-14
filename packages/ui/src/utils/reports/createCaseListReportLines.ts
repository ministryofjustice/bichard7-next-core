import parseAhoXml from "@moj-bichard7/core/lib/parse/parseAhoXml/parseAhoXml"
import { isError } from "lodash"
import type CourtCase from "services/entities/CourtCase"
import type { Report, CaseList } from "./Report"

export const createCaseListReportLines = (courtCases: CourtCase[]): Report<CaseList> => {
  const report = courtCases.map((courtCase) => {
    const aho = parseAhoXml(courtCase.hearingOutcome)

    const errorCodes = courtCase.errorReport.split(", ").map((reason) => reason.split("||")[0])
    const triggerCodes = courtCase.triggers.map((trigger) => trigger.triggerCode)

    const reportLine: CaseList = {
      PTIURN: courtCase.ptiurn,
      defendantName: courtCase.defendantName,
      courtName: courtCase.courtName,
      courtDate: "",
      notes: courtCase.notes.map((note) => `${note.userId}: ${note.noteText}`).join("\n"),
      reason: errorCodes.concat(triggerCodes).join("\n"),
      errorsLockedBy: courtCase.errorLockedByUsername || "",
      triggersLockedBy: courtCase.triggerLockedByUsername || ""
    }

    if (!isError(aho)) {
      reportLine.courtDate = aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.DateOfHearing.toISOString() || ""
    }

    return reportLine
  })

  return { report }
}
