import type { UserSummaryReportQuery } from "@moj-bichard7/common/contracts/UserSummaryReportQuery"
import type { UserPerformanceSummaryDto } from "@moj-bichard7/common/types/reports/UserPerformanceSummary"
import type { User } from "@moj-bichard7/common/types/User"

import { ResolutionStatusNumber } from "@moj-bichard7/common/types/ResolutionStatus"
import { endOfDay, startOfDay } from "date-fns"

import type { TransactionConnection } from "../../../../types/DatabaseGateway"
import type { UserSummaryRow } from "../../../../types/reports/UserSummary"

import { processUserPerformanceSummaryReport } from "../../../../useCases/cases/reports/usersSummary/processUserPerformanceSummaryReport"
import { organisationUnitSql } from "../../organisationUnitSql"

export async function* userPerformanceSummary(
  database: TransactionConnection,
  user: User,
  filters: UserSummaryReportQuery
): AsyncGenerator<UserPerformanceSummaryDto[]> {
  const query = database.connection<UserSummaryRow[]>`
    WITH aggregated_activity AS (
      SELECT
        report_date,
        username,
        SUM(exception_count) AS exceptions_resolved,
        SUM(trigger_count) AS triggers_resolved
      FROM (
         SELECT
           DATE(el.error_resolved_ts) AS report_date,
           el.error_resolved_by AS username,
           COUNT(el.error_id) AS exception_count,
           0 AS trigger_count
         FROM br7own.error_list el
         WHERE 
           el.error_resolved_by IS NOT NULL
           AND el.error_status = ${ResolutionStatusNumber.Resolved}
           AND el.error_resolved_ts >= ${startOfDay(filters.fromDate)}
           AND el.error_resolved_ts <= ${endOfDay(filters.toDate)}
           AND (${organisationUnitSql(database, user)})
         GROUP BY 
           DATE(el.error_resolved_ts), 
           el.error_resolved_by

         UNION ALL

         SELECT
           DATE(elt.resolved_ts) AS report_date,
           elt.resolved_by AS username,
           0 AS exception_count,
           COUNT(elt.trigger_id) AS trigger_count
         FROM br7own.error_list el
         INNER JOIN br7own.error_list_triggers elt ON el.error_id = elt.error_id
         WHERE 
           elt.resolved_by IS NOT NULL
           AND elt.status = ${ResolutionStatusNumber.Resolved}
           AND elt.resolved_ts >= ${startOfDay(filters.fromDate)}
           AND elt.resolved_ts <= ${endOfDay(filters.toDate)}
           AND (${organisationUnitSql(database, user)})
         GROUP BY 
           DATE(elt.resolved_ts), 
           elt.resolved_by
      ) pre_agg
      GROUP BY report_date, username
    ),
    locked_items AS (
      SELECT
        username,
        SUM(locked_count) AS total_locked
      FROM (
        SELECT 
          el.error_locked_by_id AS username, 
          COUNT(el.error_id) AS locked_count
        FROM br7own.error_list el
        WHERE 
          el.error_locked_by_id IS NOT NULL
          AND el.error_status = ${ResolutionStatusNumber.Unresolved}
          AND (${organisationUnitSql(database, user)})
        GROUP BY el.error_locked_by_id

        UNION ALL

        SELECT 
          el.trigger_locked_by_id AS username, 
          COUNT(elt.trigger_id) AS locked_count
        FROM br7own.error_list el
        INNER JOIN br7own.error_list_triggers elt ON el.error_id = elt.error_id
        WHERE 
          el.trigger_locked_by_id IS NOT NULL
          AND elt.status = ${ResolutionStatusNumber.Unresolved}
          AND (${organisationUnitSql(database, user)})
        GROUP BY el.trigger_locked_by_id
      ) combined_locks
      GROUP BY username
    )
    SELECT
      COALESCE(a.report_date, CURRENT_DATE) AS report_date,
      u.id AS user_id,
      COALESCE(a.username, l.username) AS username,
      TRIM(CONCAT_WS(' ', u.forenames, u.surname)) AS full_name,
      COALESCE(a.exceptions_resolved, 0) AS exceptions_resolved,
      COALESCE(a.triggers_resolved, 0) AS triggers_resolved,
      COALESCE(l.total_locked, 0) AS total_locked
    FROM aggregated_activity a
    FULL OUTER JOIN locked_items l ON l.username = a.username
    LEFT JOIN br7own.users u ON u.username = COALESCE(a.username, l.username)
    ORDER BY
      report_date DESC,
      username ASC
  `

  try {
    const cursor = query.cursor(100)

    yield* processUserPerformanceSummaryReport(cursor, filters.fromDate, filters.toDate)
  } catch (err) {
    throw new Error(`Error fetching user summary report: ${(err as Error).message}`)
  }
}
