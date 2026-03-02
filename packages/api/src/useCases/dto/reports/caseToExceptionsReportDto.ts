import type { CaseForExceptionReportDto } from "@moj-bichard7/common/types/reports/Exceptions"

import getShortAsn from "@moj-bichard7/common/utils/getShortAsn"
import { format } from "date-fns"

import type { CaseRowForExceptionReport } from "../../../types/reports/Exceptions"

import { formatDate } from "../../cases/reports/utils/formatDate"

const NOTE_PORTAL_ACTION_RESUBMITTED = "Portal Action: Resubmitted Message"
const NOTE_PORTAL_ACTION_MANUALLY_RESOLVED = "Portal Action: Record Manually Resolved. Reason: "
const NOTE_REASON_TEXT = " Reason Text: "

export const caseToExceptionsReportDto = (caseRow: CaseRowForExceptionReport): CaseForExceptionReportDto => {
  const isTrigger = caseRow.type?.toLowerCase().includes("trigger")
  const isError = caseRow.type?.toLowerCase().includes("exception")

  let resolutionAction = isTrigger ? "Trigger activity performed" : ""

  // Use optional chaining and nullish coalescing to prevent crashes
  const notesString = (caseRow.notes ?? []).reduceRight((acc, note) => {
    const noteText = note.note_text || ""

    // Identify Resolution Action only for Errors
    if (!resolutionAction && isError) {
      if (noteText.includes(NOTE_PORTAL_ACTION_RESUBMITTED)) {
        resolutionAction = "Resolved via re-submission"
      } else if (noteText.includes(NOTE_PORTAL_ACTION_MANUALLY_RESOLVED)) {
        const marker = NOTE_PORTAL_ACTION_MANUALLY_RESOLVED
        const pos1 = noteText.indexOf(marker) + marker.length
        const pos2 = noteText.indexOf(NOTE_REASON_TEXT, pos1)

        const actionText = pos2 !== -1 ? noteText.substring(pos1, pos2).trim() : noteText.substring(pos1).trim()
        const reasonText = pos2 !== -1 ? noteText.substring(pos2 + NOTE_REASON_TEXT.length).trim() : ""

        resolutionAction = reasonText ? `${actionText} (${reasonText})` : actionText
      }
    }

    const formattedNote = `${noteText} [${note.user_id} ${format(note.create_ts, "dd/MM/yyyy HH:mm")}]`

    return acc ? `${formattedNote}\n\n${acc}` : formattedNote
  }, "")

  return {
    asn: getShortAsn(caseRow.asn),
    courtName: caseRow.court_name,
    courtReference: caseRow.court_reference,
    courtRoom: caseRow.court_room,
    defendantName: caseRow.defendant_name,
    hearingDate: formatDate(caseRow.court_date),
    messageReceivedAt: formatDate(caseRow.msg_received_ts, true),
    notes: notesString,
    ptiurn: caseRow.ptiurn,
    resolutionAction,
    resolvedAt: formatDate(caseRow.resolved_ts, true),
    resolver: caseRow.resolver,
    type: isTrigger ? "Tr" : "Ex"
  }
}
