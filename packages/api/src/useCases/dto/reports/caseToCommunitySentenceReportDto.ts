import type { CommunitySentenceReportDto } from "@moj-bichard7/common/types/reports/CommunitySentence"

import { parseHearingOutcome } from "@moj-bichard7/common/aho/parseHearingOutcome"
import { isError } from "@moj-bichard7/common/types/Result"
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

// Move to trigger
const SUSPENDED_SENTENCE_ORDER_RESULT_CODES = [1115, 1134, 1508, 1507]
const SENTENCING_ACT_RESULT_CODES = [1030, 1032, 1115, 1116, 1134, 1507, 1508, 4575, 4576, 4577]

export function caseToCommunitySentenceDto(row: CommunitySentenceRowReport): CommunitySentenceReportDto[] {
  const aho = parseHearingOutcome(row.annotated_msg)

  if (isError(aho)) {
    throw aho
  }

  const caseLevelDetails = {
    dateOfBirth: dateOfBirth(aho),
    defendantName: row.defendant_name ?? null,
    domesticViolenceFlag: getYesOrNo(row.domestic_violence_flag),
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

    const filtered = offence.Result.filter((result) => SENTENCING_ACT_RESULT_CODES.includes(result.CJSresultCode))

    return filtered.map((result) => {
      const resultLevelDetails = {
        ...offenceLevelDetails,
        plea: getPleaStatus(result.PleaStatus)
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
