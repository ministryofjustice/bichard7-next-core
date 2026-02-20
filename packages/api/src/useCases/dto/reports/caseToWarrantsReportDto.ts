import type { CaseForWarrantsReportDto } from "@moj-bichard7/common/contracts/WarrantsReport"

import { parseAhoXml } from "@moj-bichard7/common/aho/parseAhoXml/index"
import { isError } from "@moj-bichard7/common/types/Result"
import getShortAsn from "@moj-bichard7/common/utils/getShortAsn"
import { differenceInCalendarDays } from "date-fns"

import type { CaseRowForWarrantsReport } from "../../../types/reports/Warrants"

import { dateOfBirth } from "../../cases/reports/utils/dateOfBirth"
import { defendantAddress } from "../../cases/reports/utils/defendantAddress"
import { formatDate } from "../../cases/reports/utils/formatDate"
import { hearingTime } from "../../cases/reports/utils/hearingTime"
import { hearingOutcomeDetails } from "../../cases/reports/warrants/transformers/hearingOutcomeDetails"
import { gender } from "../../cases/reports/warrants/utils/gender"
import { pncIdentifier } from "../../cases/reports/warrants/utils/pncIdentifier"
import { resolutionStatusFromDb } from "../convertResolutionStatus"

export const caseToWarrantsReportDto = (caseRow: CaseRowForWarrantsReport): CaseForWarrantsReportDto => {
  const aho = parseAhoXml(caseRow.annotated_msg)

  if (isError(aho)) {
    throw aho
  }

  const triggerCodes = new Set(caseRow.triggers.map((t) => t.trigger_code))

  const outcomes = hearingOutcomeDetails(aho, triggerCodes.has("TRPR0012"), triggerCodes.has("TRPR0002"))

  const latestTrigger = caseRow.triggers[0]

  return {
    asn: getShortAsn(caseRow.asn),
    bailOrNoBail: outcomes.bailStatus,
    courtName: caseRow.court_name ?? "",
    dateOfBirth: dateOfBirth(aho),
    dateTimeReceivedByCJSE: formatDate(caseRow.msg_received_ts, true),
    defendantAddress: defendantAddress(aho),
    defendantName: caseRow.defendant_name ?? "",
    gender: gender(aho),
    hearingDate: formatDate(caseRow.court_date),
    hearingTime: hearingTime(aho),
    nextCourtAppearance: outcomes.nextCourtName,
    nextCourtAppearanceDate: outcomes.nextCourtDate,
    numberOfDaysTakenToEnterPortal:
      caseRow.court_date > caseRow.msg_received_ts
        ? undefined
        : differenceInCalendarDays(caseRow.msg_received_ts, caseRow.court_date),
    offencesTitle: outcomes.offenceTitles,
    offencesWording: outcomes.offenceWordings,
    pncId: pncIdentifier(aho),
    ptiurn: caseRow.ptiurn ?? "",
    triggerResolvedDate: formatDate(latestTrigger.resolved_ts),
    triggerStatus: resolutionStatusFromDb(latestTrigger.status) ?? "Unknown",
    warrantText: outcomes.warrantText,
    warrantType: outcomes.warrantType
  }
}
