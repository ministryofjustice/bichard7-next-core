import parseAhoXml from "@moj-bichard7/common/aho/parseAhoXml/parseAhoXml"
import {
  type CaseForDomesticViolenceReportDto,
  type DomesticViolenceReportType
} from "@moj-bichard7/common/contracts/DomesticViolenceReport"
import { isError } from "@moj-bichard7/common/types/Result"
import getShortAsn from "@moj-bichard7/common/utils/getShortAsn"
import { format } from "date-fns"

import type { CaseRowForDomesticViolenceReport } from "../../../types/reports/DomesticViolence"

// Java loaded this from properties; standard Excel limit safe-guard
const TRUNCATED_TEXT_SUFFIX = "[TEXT TRUNCATED - REFER TO REGISTER OR BICHARD 7 PORTAL]"
const MAX_FIELD_LENGTH = 1000
const truncateResultText = (text: string): string => {
  if (text.length <= MAX_FIELD_LENGTH) {
    return text
  }

  const cutOff = Math.max(0, MAX_FIELD_LENGTH - TRUNCATED_TEXT_SUFFIX.length)
  return text.substring(0, cutOff) + TRUNCATED_TEXT_SUFFIX
}

export function* caseToDomesticViolenceReportDto(
  row: CaseRowForDomesticViolenceReport
): Generator<CaseForDomesticViolenceReportDto> {
  const aho = parseAhoXml(row.annotated_msg)

  if (isError(aho)) {
    throw aho
  }

  const defendant = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant
  const dobRaw = defendant.DefendantDetail?.BirthDate
  const dateOfBirth = dobRaw ? format(new Date(dobRaw), "dd/MM/yyyy") : ""
  const offences = defendant.Offence ?? []

  const isDomesticViolence = row.trigger_codes.includes("TRPR0023")
  const reportType: DomesticViolenceReportType = isDomesticViolence ? "Domestic Violence" : "Vulnerable Victim"

  const hearingDate = row.court_date ? format(row.court_date, "dd/MM/yyyy") : ""

  const sharedData = {
    asn: getShortAsn(row.asn),
    courtName: row.court_name ?? "",
    dateOfBirth,
    defendantName: row.defendant_name ?? "",
    hearingDate,
    ptiurn: row.ptiurn ?? "",
    type: reportType
  }

  for (const offence of offences) {
    const outcomeText = (offence.Result ?? []).reduce((acc, result) => {
      const text = result.ResultVariableText
      if (text) {
        if (acc.length > 0) {
          acc += "\n"
        }

        acc += text
      }

      return acc
    }, "")

    yield {
      ...sharedData,
      offenceTitle: offence.OffenceTitle ?? "Unavailable",
      outcome: truncateResultText(outcomeText)
    }
  }
}
