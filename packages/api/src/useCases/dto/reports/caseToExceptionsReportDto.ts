import type { CaseForExceptionReportDto } from "@moj-bichard7/common/contracts/ExceptionReportDto"

import getShortAsn from "@moj-bichard7/common/utils/getShortAsn"
import { sortBy } from "lodash"

import type { CaseRowForExceptionReport } from "../../../types/reports/Exceptions"

import { convertNoteToDto } from "../convertNoteToDto"

export const caseToExceptionsReportDto = (caseRow: CaseRowForExceptionReport): CaseForExceptionReportDto => {
  return {
    asn: getShortAsn(caseRow.asn),
    courtName: caseRow.court_name,
    courtReference: caseRow.court_reference,
    courtRoom: caseRow.court_room,
    defendantName: caseRow.defendant_name,
    hearingDate: caseRow.court_date,
    messageReceivedAt: caseRow.msg_received_ts,
    notes: caseRow.notes ? sortBy(caseRow.notes, "create_ts").reverse().map(convertNoteToDto) : [],
    ptiurn: caseRow.ptiurn,
    resolvedAt: caseRow.resolved_ts,
    resolver: caseRow.resolver,
    type: caseRow.type
  }
}
