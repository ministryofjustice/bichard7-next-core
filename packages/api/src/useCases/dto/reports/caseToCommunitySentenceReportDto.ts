import type { CommunitySentenceReportDto } from "@moj-bichard7/common/types/reports/CommunitySentence"

import { parseHearingOutcome } from "@moj-bichard7/common/aho/parseHearingOutcome"
import { isError } from "@moj-bichard7/common/types/Result"

import type { CommunitySentenceRowReport } from "../../../types/reports/CommunitySentence"

import { dateOfBirth } from "../../cases/reports/utils/dateOfBirth"
import { formatDate } from "../../cases/reports/utils/formatDate"

export function* caseToCommunitySentenceDto(row: CommunitySentenceRowReport): Generator<CommunitySentenceReportDto> {
  const aho = parseHearingOutcome(row.annotated_msg)

  if (isError(aho)) {
    throw aho
  }

  // const aggregatedOffences = formatOffenceData(aho)

  // caseRef: z.string(),
  // dateOfBirth: z.string(),
  // dateOfSentence: z.string(),
  // defendantName: z.string().nullish(),
  // domesticViolenceFlag: z.boolean(),
  // expiryOfSentence: z.string(),
  // offenceType: z.string(),
  // pncId: z.string(),
  // receivedDate: z.string(),
  // suspendedSentenceOrderDuration: z.number()

  yield {
    dateOfBirth: dateOfBirth(aho),
    dateOfSentence: new Date().toDateString(), //aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Result?.DateSpecifiedInResult,
    defendantName: row.defendant_name ?? null,
    domesticViolenceFlag: false,
    expiryOfSentence: new Date().toDateString(),
    offenceType: "Offence Type",
    pncId: aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.PNCIdentifier ?? "",
    receivedDate: formatDate(row.msg_received_ts, true, true),
    suspendedSentenceOrderDuration: 0
  }
}
