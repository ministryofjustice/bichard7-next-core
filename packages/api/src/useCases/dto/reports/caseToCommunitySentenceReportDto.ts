import type { CommunitySentenceReportDto } from "@moj-bichard7/common/types/reports/CommunitySentence"

import { parseHearingOutcome } from "@moj-bichard7/common/aho/parseHearingOutcome"
import { isError } from "@moj-bichard7/common/types/Result"
import {
  SUSPENDED_SENTENCE_ORDER_RESULT_CODES,
  TRPR0031_RESULT_CODES
} from "@moj-bichard7/common/utils/triggerConstants"
import {
  addDurationToDate,
  formatDuration,
  getPleaStatus,
  getYesOrNo
} from "@moj-bichard7/common/utils/valueTransformers"

import type { CommunitySentenceRowReport } from "../../../types/reports/CommunitySentence"

import { dateOfBirth } from "../../cases/reports/utils/dateOfBirth"
import { defendantAddress } from "../../cases/reports/utils/defendantAddress"
import { formatDate } from "../../cases/reports/utils/formatDate"

export function caseToCommunitySentenceDto(
  row: CommunitySentenceRowReport,
  resultCodes: string[] = []
): CommunitySentenceReportDto[] {
  const aho = parseHearingOutcome(row.annotated_msg)

  if (isError(aho)) {
    throw aho
  }

  const caseLevelDetails = {
    dateOfBirth: dateOfBirth(aho),
    defendantName: row.defendant_name ?? null,
    domesticViolenceFlag: getYesOrNo(row.domestic_violence_flag),
    errorId: row.error_id,
    homeAddress: defendantAddress(aho),
    pncId: aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.PNCIdentifier ?? "",
    receivedDate: formatDate(row.msg_received_ts, false, true)
  } as CommunitySentenceReportDto

  const reports = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.flatMap((offence) => {
    const offenceLevelDetails = {
      ...caseLevelDetails,
      arrestDate: offence.ArrestDate ? formatDate(offence.ArrestDate, false, true) : "",
      chargeDate: offence.ChargeDate ? formatDate(offence.ChargeDate, false, true) : "",
      dateOfSentence: offence.ConvictionDate ? formatDate(offence.ConvictionDate, false, true) : "",
      offenceAddress: offence.LocationOfOffence ?? "",
      offenceStartDate: offence.ActualOffenceStartDate
        ? formatDate(offence.ActualOffenceStartDate.StartDate, false, true)
        : "",
      offenceTitle: offence.OffenceTitle ?? ""
    }

    const targetResultCodes = resultCodes?.length ? resultCodes : TRPR0031_RESULT_CODES
    const validResultCodeSet = new Set(targetResultCodes.map(String))

    const matchingResults = offence.Result.filter((result) => validResultCodeSet.has(String(result.CJSresultCode)))

    return matchingResults.map((result) => {
      const resultLevelDetails = {
        ...offenceLevelDetails,
        plea: getPleaStatus(result.PleaStatus),
        resultCode: result.CJSresultCode
      }

      if (SUSPENDED_SENTENCE_ORDER_RESULT_CODES.includes(result.CJSresultCode)) {
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
          ...resultLevelDetails,
          custodialSentenceDurationMonths: custodialDuration.toLowerCase(),
          expiryOfSentence: formatDate(expiryOfSentence, false, true),
          suspendedSentenceDurationMonths: suspendedDuration.toLowerCase()
        } as CommunitySentenceReportDto
      } else {
        return resultLevelDetails
      }
    })
  })

  return reports
}
