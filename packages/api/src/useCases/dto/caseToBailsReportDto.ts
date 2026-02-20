import type { CaseForBailsReportDto } from "@moj-bichard7/common/contracts/BailsReport"

import { parseAhoXml } from "@moj-bichard7/common/aho/parseAhoXml/index"
import { isError } from "@moj-bichard7/common/types/Result"
import getShortAsn from "@moj-bichard7/common/utils/getShortAsn"
import { differenceInCalendarDays, format } from "date-fns"

import type { CaseRowForBailsReport } from "../../types/Reports"

import * as logic from "../cases/reports/bails/reportLogic"

export function* caseToBailsReportDto(row: CaseRowForBailsReport): Generator<CaseForBailsReportDto> {
  const aho = parseAhoXml(row.annotated_msg)

  if (isError(aho)) {
    throw aho
  }

  const aggregatedOffences = logic.aggregateOffenceData(aho)

  const sharedData = {
    asn: getShortAsn(row.asn),
    automatedToPNC: logic.getCaseAutomatedToPNC(aho, row.error_count),
    bailConditions: logic.getBailConditionsImposed(aho),
    courtName: row.court_name ?? null,
    dateOfBirth: format(new Date(logic.getDateOfBirth(aho)), "dd/MM/yyyy"),
    daysToEnterPortal:
      row.court_date > row.msg_received_ts ? null : differenceInCalendarDays(row.msg_received_ts, row.court_date),
    defendantAddress: logic.getDefendantAddress(aho),
    defendantName: row.defendant_name ?? null,
    hearingDate: format(row.court_date, "dd/MM/yyyy"),
    hearingTime: logic.getHearingTime(aho),
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
      triggerResolvedDate: logic.formatDate(trigger.resolved_ts),
      triggerStatus: logic.getTriggerStatus(trigger.status)
    }
  }
}
