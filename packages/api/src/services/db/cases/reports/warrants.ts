import type { CaseForWarrantsReportDto } from "@moj-bichard7/common/contracts/WarrantsReport"
import type { User } from "@moj-bichard7/common/types/User"

import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import { endOfDay, startOfDay } from "date-fns"

import type { DatabaseConnection } from "../../../../types/DatabaseGateway"
import type { CaseRowForWarrantsReport } from "../../../../types/reports/Warrants"

import { processCases } from "../../../../useCases/cases/reports/warrants/processCases"
import { organisationUnitSql } from "../../organisationUnitSql"

type WarrantReportQuery = {
  fromDate: Date
  toDate: Date
}

const WARRANT_TRIGGER_CODES = [TriggerCode.TRPR0002, TriggerCode.TRPR0012] as const

export const warrants = async (
  database: DatabaseConnection,
  user: User,
  filters: WarrantReportQuery,
  processChunk: (rows: CaseForWarrantsReportDto[]) => Promise<void>
) => {
  const warrantQuery = database.connection<CaseRowForWarrantsReport[]>`
    WITH filtered_ids AS (
      SELECT
        el.error_id
      FROM br7own.error_list el
             JOIN br7own.error_list_triggers elt ON el.error_id = elt.error_id
      WHERE el.msg_received_ts BETWEEN ${startOfDay(filters.fromDate)} AND ${endOfDay(filters.toDate)}
        AND (${organisationUnitSql(database, user)})
        AND elt.trigger_code = ANY (${WARRANT_TRIGGER_CODES})
      GROUP BY el.error_id
      ORDER BY MAX(el.msg_received_ts)
    ),
    aggregated_triggers AS (
      SELECT
      elt.error_id,
        json_agg(
         json_build_object(
           'trigger_id', elt.trigger_id,
           'trigger_code', elt.trigger_code,
           'status', elt.status,
           'create_ts', elt.create_ts,
           'resolved_by', elt.resolved_by,
           'resolved_ts', elt.resolved_ts,
           'trigger_item_identity', elt.trigger_item_identity,
           'error_id', elt.error_id
         ) ORDER BY elt.resolved_ts DESC
        ) AS triggers
      FROM br7own.error_list_triggers elt
      INNER JOIN filtered_ids f ON f.error_id = elt.error_id
      WHERE elt.trigger_code = ANY (${WARRANT_TRIGGER_CODES})
      GROUP BY elt.error_id
    )
    SELECT
      el.annotated_msg,
      el.asn,
      el.court_date,
      el.court_name,
      el.defendant_name,
      el.error_id,
      el.msg_received_ts,
      el.ptiurn,
      at.triggers
    FROM filtered_ids f
    JOIN br7own.error_list el ON f.error_id = el.error_id
    JOIN aggregated_triggers at ON f.error_id = at.error_id
    ORDER BY el.msg_received_ts
  `

  try {
    await warrantQuery.cursor(50, async (rows) => {
      await processChunk(processCases(rows))
    })
  } catch (err) {
    throw new Error(`Error fetching report: ${(err as Error).message}`)
  }
}
