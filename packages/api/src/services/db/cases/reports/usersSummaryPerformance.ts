import type { UserSummaryReportQuery } from "@moj-bichard7/common/contracts/UserSummaryReportQuery"
import type { UsersSummaryPerformanceDto } from "@moj-bichard7/common/types/reports/UsersSummaryPerformance"
import type { User } from "@moj-bichard7/common/types/User"

import { ResolutionStatusNumber } from "@moj-bichard7/common/types/ResolutionStatus"
import { endOfDay, startOfDay } from "date-fns"

import type { TransactionConnection } from "../../../../types/DatabaseGateway"
import type { UserSummaryRow } from "../../../../types/reports/UserSummary"

import { processUsersSummaryReport } from "../../../../useCases/cases/reports/usersSummary/processUserSummaryReport"
import { organisationUnitSql } from "../../organisationUnitSql"

export async function* usersSummaryPerformance(
  database: TransactionConnection,
  user: User,
  filters: UserSummaryReportQuery
): AsyncGenerator<UsersSummaryPerformanceDto> {
  const query = database.connection<UserSummaryRow[]>`
    WITH combined_activity AS (
      SELECT 
        DATE(el.error_resolved_ts) AS report_date, 
        el.error_resolved_by AS username, 
        1 AS exception_count,
        0 AS trigger_count
      FROM br7own.error_list el
      WHERE el.error_resolved_by IS NOT NULL 
        AND el.error_status = ${ResolutionStatusNumber.Resolved} 
        AND el.error_resolved_ts >= ${startOfDay(filters.fromDate)}
        AND el.error_resolved_ts <= ${endOfDay(filters.toDate)}
        AND (${organisationUnitSql(database, user)})

      UNION ALL
      
      SELECT 
        DATE(elt.resolved_ts) AS report_date, 
        elt.resolved_by AS username, 
        0 AS exception_count,
        1 AS trigger_count
      FROM br7own.error_list el 
      INNER JOIN br7own.error_list_triggers elt ON el.error_id = elt.error_id
      WHERE elt.resolved_by IS NOT NULL 
        AND elt.status = ${ResolutionStatusNumber.Resolved} 
        AND elt.resolved_ts >= ${startOfDay(filters.fromDate)}
        AND elt.resolved_ts <= ${endOfDay(filters.toDate)}
        AND (${organisationUnitSql(database, user)})
    ),
    aggregated_activity AS (
      SELECT 
        report_date, 
        username, 
        SUM(exception_count) AS exceptions_resolved, 
        SUM(trigger_count) AS triggers_resolved
      FROM combined_activity
      GROUP BY report_date, username
    ),
    locked_items AS (
      SELECT
        username,
        SUM(locked_count) AS total_locked
      FROM (
        SELECT el.error_locked_by_id AS username, COUNT(el.error_id) AS locked_count
        FROM br7own.error_list el
        WHERE 
         el.error_locked_by_id IS NOT NULL
         AND el.error_status = ${ResolutionStatusNumber.Unresolved}
         AND (${organisationUnitSql(database, user)})
        GROUP BY el.error_locked_by_id
      
        UNION ALL
        
        SELECT el.trigger_locked_by_id AS username, COUNT(el.error_id) AS locked_count
        FROM br7own.error_list el
        WHERE 
          el.trigger_locked_by_id IS NOT NULL
          AND el.trigger_status = ${ResolutionStatusNumber.Unresolved}
          AND (${organisationUnitSql(database, user)})
        GROUP BY el.trigger_locked_by_id
      ) combined_locks
    GROUP BY username
    )
    SELECT
      a.report_date,
      u.id AS user_id,
      u.username,
      TRIM(CONCAT_WS(' ', u.forenames, u.surname)) AS full_name,
      a.exceptions_resolved,
      a.triggers_resolved,
      COALESCE(l.total_locked, 0) AS total_locked
    FROM aggregated_activity a
    LEFT JOIN br7own.users u 
      ON u.username = a.username
    LEFT JOIN locked_items l 
      ON l.username = a.username
    ORDER BY 
      a.report_date DESC, 
      u.username ASC
  `

  try {
    const cursor = query.cursor(100)
    yield* processUsersSummaryReport(cursor, filters.fromDate, filters.toDate)
  } catch (err) {
    throw new Error(`Error fetching user summary report: ${(err as Error).message}`)
  }
}
