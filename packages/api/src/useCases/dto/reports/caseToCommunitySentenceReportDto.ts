import type { CommunitySentenceReportDto } from "@moj-bichard7/common/types/reports/CommunitySentence"

import { parseHearingOutcome } from "@moj-bichard7/common/aho/parseHearingOutcome"
import { isError } from "@moj-bichard7/common/types/Result"
import { addDurationToDate, formatDuration, getYesOrNo } from "@moj-bichard7/common/utils/valueTransformers"

import type { CommunitySentenceRowReport } from "../../../types/reports/CommunitySentence"

import { dateOfBirth } from "../../cases/reports/utils/dateOfBirth"
import { formatDate } from "../../cases/reports/utils/formatDate"

const SUSPENDED_SENTENCE_ORDER_RESULT_CODES = [1115, 1134, 1508, 1507]

export function caseToCommunitySentenceDto(row: CommunitySentenceRowReport): CommunitySentenceReportDto[] {
  const aho = parseHearingOutcome(row.annotated_msg)

  if (isError(aho)) {
    throw aho
  }

  const caseLevelDetails = {
    dateOfBirth: dateOfBirth(aho),
    dateOfSentence: "",
    defendantName: row.defendant_name ?? null,
    domesticViolenceFlag: getYesOrNo(row.domestic_violence_flag),
    expiryOfSentence: "",
    offenceTitle: "",
    pncId: aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.PNCIdentifier ?? "",
    receivedDate: formatDate(row.msg_received_ts, false, true)
  } as CommunitySentenceReportDto

  const reports = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.flatMap((offence) => {
    const offenceLevelDetails = {
      ...caseLevelDetails,
      dateOfSentence: offence.ConvictionDate ? formatDate(offence.ConvictionDate, false, true) : "",
      offenceTitle: offence.OffenceTitle ?? ""
    }

    const suspendedResults = offence.Result.filter((result) =>
      SUSPENDED_SENTENCE_ORDER_RESULT_CODES.includes(result.CJSresultCode)
    )

    if (suspendedResults.length > 0) {
      const suspendedSentenceReports = suspendedResults.map((result) => {
        const custodialDurationObj = result.Duration?.find((d) => d.DurationType === "Duration")
        const suspendedDurationObj = result.Duration?.find((d) => d.DurationType === "Suspended")

        const custodialDuration = custodialDurationObj
          ? formatDuration(custodialDurationObj.DurationLength, custodialDurationObj.DurationUnit, true)
          : ""
        const suspendedDuration = suspendedDurationObj
          ? formatDuration(suspendedDurationObj.DurationLength, suspendedDurationObj.DurationUnit, true)
          : ""

        const expiryOfSentence =
          suspendedDurationObj && offence.ConvictionDate
            ? addDurationToDate(
                offence.ConvictionDate,
                suspendedDurationObj.DurationLength,
                suspendedDurationObj.DurationUnit
              )
            : ""

        return {
          ...offenceLevelDetails,
          custodialSentenceDurationMonths: custodialDuration,
          expiryOfSentence: formatDate(expiryOfSentence, false, true),
          suspendedSentenceDurationMonths: suspendedDuration
        } as CommunitySentenceReportDto
      })
      return suspendedSentenceReports
    } else {
      return [offenceLevelDetails]
    }
  })

  return reports
}
