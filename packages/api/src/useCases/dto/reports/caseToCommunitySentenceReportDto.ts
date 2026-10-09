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

  yield {
    dateOfBirth: dateOfBirth(aho),
    dateOfSentence: new Date().toDateString(), //aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Result?.DateSpecifiedInResult,
    defendantName: row.defendant_name ?? null,
    domesticViolenceFlag: row.domestic_violence_flag,
    expiryOfSentence: new Date().toDateString(), // need to get
    offenceType: "Offence Type", // need to get
    pncId: aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.PNCIdentifier ?? "",
    receivedDate: formatDate(row.msg_received_ts, true, true),
    suspendedSentenceOrderDuration: 0 // need to get
  }
}
