import type { DomesticViolenceReportQuery } from "@moj-bichard7/common/contracts/DomesticViolenceReport"
import type { CaseForDomesticViolenceReportDto } from "@moj-bichard7/common/types/reports/DomesticViolence"
import type { User } from "@moj-bichard7/common/types/User"

import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import { endOfDay, startOfDay } from "date-fns"

import type { DatabaseConnection } from "../../../../types/DatabaseGateway"
import type { CaseRowForDomesticViolenceReport } from "../../../../types/reports/DomesticViolence"

import { processCasesForDomesticViolenceReport } from "../../../../useCases/cases/reports/domesticViolence/processCasesForDomesticViolenceReport"
import { organisationUnitSql } from "../../organisationUnitSql"

const DV_TRIGGERS = [TriggerCode.TRPR0023, TriggerCode.TRPR0024]

export async function* domesticViolenceReport(
  database: DatabaseConnection,
  user: User,
  filters: DomesticViolenceReportQuery
): AsyncGenerator<CaseForDomesticViolenceReportDto[]> {
  const query = database.connection<CaseRowForDomesticViolenceReport[]>`
    SELECT 
      el.error_id,
      el.court_date,
      el.court_name,
      el.annotated_msg,
      el.defendant_name,
      el.ptiurn,
      el.asn,
      el.msg_received_ts,
      el.error_count,
      json_agg(elt.trigger_code) AS trigger_codes
    FROM br7own.error_list el
    INNER JOIN br7own.error_list_triggers elt ON el.error_id = elt.error_id
    WHERE 
      el.msg_received_ts BETWEEN ${startOfDay(filters.fromDate)} AND ${endOfDay(filters.toDate)}
      AND elt.trigger_code = ANY (${DV_TRIGGERS})
      AND (${organisationUnitSql(database, user)})
    GROUP BY
      el.error_id,
      el.court_date,
      el.court_name,
      el.annotated_msg,
      el.defendant_name,
      el.ptiurn,
      el.asn,
      el.msg_received_ts,
      el.error_count
    ORDER BY el.msg_received_ts, el.error_id
  `

  try {
    const cursor = query.cursor(100)
    for await (const rows of cursor) {
      yield processCasesForDomesticViolenceReport(rows)
    }
  } catch (err) {
    throw new Error(`Error fetching Domestic Violence report: ${(err as Error).message}`)
  }
}
