import type {
  CaseForWarrantsReportDto,
  CaseRowForWarrantsReport
} from "@moj-bichard7/common/types/reports/WarrantsReport"

import { parseAhoXml } from "@moj-bichard7/common/aho/parseAhoXml/index"
import { isError } from "@moj-bichard7/common/types/Result"
import getShortAsn from "@moj-bichard7/common/utils/getShortAsn"

import {
  dateOfBirth,
  defendantAddress,
  formatDate,
  gender,
  hearingTime,
  pncIdentifier
} from "../../cases/reports/warrants/extractionUtils"
import { hearingOutcomeDetails } from "../../cases/reports/warrants/transformers/hearingOutcomeDetails"

export const caseToWarrantsReportDto = (caseRow: CaseRowForWarrantsReport): CaseForWarrantsReportDto => {
  const aho = parseAhoXml(caseRow.annotated_msg)

  if (isError(aho)) {
    throw aho
  }

  const triggerCodes = new Set(caseRow.triggers.map((t) => t.trigger_code))

  const outcomes = hearingOutcomeDetails(aho, triggerCodes.has("TRPR0012"), triggerCodes.has("TRPR0002"))

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
    offencesTitle: outcomes.offenceTitles,
    offencesWording: outcomes.offenceWordings,
    pncId: pncIdentifier(aho),
    ptiurn: caseRow.ptiurn ?? "",
    warrantText: outcomes.warrantText,
    warrantType: outcomes.warrantType
  }
}
