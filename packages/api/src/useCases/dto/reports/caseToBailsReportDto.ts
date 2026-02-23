import type { CaseForBailsReportDto } from "@moj-bichard7/common/types/reports/Bails"

import { parseAhoXml } from "@moj-bichard7/common/aho/parseAhoXml/index"
import { isError } from "@moj-bichard7/common/types/Result"
import getShortAsn from "@moj-bichard7/common/utils/getShortAsn"
import { differenceInCalendarDays, format } from "date-fns"

import type { CaseRowForBailsReport } from "../../../types/reports/Bails"

import { bailConditionsImposed } from "../../cases/reports/bails/utils/bailConditionsImposed"
import { caseAutomatedToPNC } from "../../cases/reports/bails/utils/caseAutomatedToPNC"
import { dateOfBirth } from "../../cases/reports/utils/dateOfBirth"
import { defendantAddress } from "../../cases/reports/utils/defendantAddress"
import { formatDate } from "../../cases/reports/utils/formatDate"
import { formatOffenceData } from "../../cases/reports/utils/formatOffenceData"
import { hearingTime } from "../../cases/reports/utils/hearingTime"
import { resolutionStatusFromDb } from "../convertResolutionStatus"

export function* caseToBailsReportDto(row: CaseRowForBailsReport): Generator<CaseForBailsReportDto> {
  const aho = parseAhoXml(row.annotated_msg)

  if (isError(aho)) {
    throw aho
  }

  const aggregatedOffences = formatOffenceData(aho)

  const sharedData = {
    asn: getShortAsn(row.asn),
    automatedToPNC: caseAutomatedToPNC(aho, row.error_count),
    bailConditions: bailConditionsImposed(aho),
    courtName: row.court_name ?? null,
    dateOfBirth: format(new Date(dateOfBirth(aho)), "dd/MM/yyyy"),
    daysToEnterPortal:
      row.court_date > row.msg_received_ts ? null : differenceInCalendarDays(row.msg_received_ts, row.court_date),
    defendantAddress: defendantAddress(aho),
    defendantName: row.defendant_name ?? null,
    hearingDate: format(row.court_date, "dd/MM/yyyy"),
    hearingTime: hearingTime(aho),
    nextAppearanceCourt: aggregatedOffences.nextCourtNames,
    nextAppearanceDate: aggregatedOffences.nextCourtDates,
    nextAppearanceTime: aggregatedOffences.nextCourtTimes,
    offenceTitles: aggregatedOffences.offenceTitles,
    ptiurn: row.ptiurn ?? "",
    receivedDate: format(row.msg_received_ts, "dd/MM/yyyy HH:mm")
  }

  for (const trigger of row.triggers) {
    yield {
      ...sharedData,
      triggerResolvedDate: formatDate(trigger.resolved_ts),
      triggerStatus: resolutionStatusFromDb(trigger.status) ?? "Unresolved"
    }
  }
}
