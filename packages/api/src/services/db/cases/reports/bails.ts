import type { BailsReportQuery, CaseForBailsReportDto } from "@moj-bichard7/common/contracts/BailsReport"
import type { User } from "@moj-bichard7/common/types/User"

import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"

import type { DatabaseConnection } from "../../../../types/DatabaseGateway"
import type { CaseRowForBailsReport } from "../../../../types/reports/Bails"

import { processCasesForBailsReport } from "../../../../useCases/cases/reports/bails/processCasesForBailsReport"
import { organisationUnitSql } from "../../organisationUnitSql"

const BAILS_TRIGGERS = [TriggerCode.TRPR0010]

export const bailsReport = async (
  database: DatabaseConnection,
  user: User,
  filters: BailsReportQuery,
  processChunk: (rows: CaseForBailsReportDto[]) => Promise<void>
): Promise<void> => {
  const query = database.connection<CaseRowForBailsReport[]>`
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
      json_agg(
        json_build_object(
          'status', elt.status,
          'resolved_ts', elt.resolved_ts,
          'trigger_code', elt.trigger_code
        ) ORDER BY elt.resolved_ts DESC
      ) AS triggers
    FROM br7own.error_list el
    INNER JOIN br7own.error_list_triggers elt ON el.error_id = elt.error_id
    WHERE 
      el.msg_received_ts BETWEEN ${filters.fromDate} AND ${filters.toDate}
      AND elt.trigger_code = ANY (${BAILS_TRIGGERS})
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
    ORDER BY el.msg_received_ts
  `

  try {
    await query.cursor(100, async (rows: CaseRowForBailsReport[]) => {
      await processChunk(processCasesForBailsReport(rows))
    })
  } catch (err) {
    throw new Error(`Error fetching report: ${(err as Error).message}`)
  }
}
