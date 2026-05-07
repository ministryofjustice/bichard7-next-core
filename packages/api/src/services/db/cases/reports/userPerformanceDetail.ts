import type { UserSummaryReportQuery } from "@moj-bichard7/common/contracts/UserSummaryReportQuery"
import type { UserPerformanceDetailDto } from "@moj-bichard7/common/types/reports/UserPerformanceDetail"
import type { User } from "@moj-bichard7/common/types/User"

import { ResolutionStatusNumber } from "@moj-bichard7/common/types/ResolutionStatus"
import { endOfDay, startOfDay } from "date-fns"

import type { TransactionConnection } from "../../../../types/DatabaseGateway"
import type { UserDetailJsonRow } from "../../../../types/reports/UserDetail"

import { processUserPerformanceDetail } from "../../../../useCases/cases/reports/usersDetail/processUserPerformanceDetail"
import { organisationUnitSql } from "../../organisationUnitSql"

export type UserDetailRow = {
  code: string
  full_name: string
  record_type: "exception" | "trigger"
  report_date: Date
  total_locked: string
  total_resolved: string
  user_id: number
  username: string
}

export async function* userPerformanceDetail(
  database: TransactionConnection,
  user: User,
  filters: UserSummaryReportQuery
): AsyncGenerator<UserPerformanceDetailDto[]> {
  const query = database.connection<UserDetailJsonRow[]>`
    WITH aggregated_activity AS (
      SELECT 
        report_date,
        record_type,
        code,
        username,
        SUM(resolved_count) AS total_resolved,
        SUM(locked_count)   AS total_locked
      FROM (
        SELECT 
          el.error_resolved_ts::DATE AS report_date,
          'exception' AS record_type,
          COALESCE(SUBSTRING(el.error_report FROM '[A-Z0-9]{8}'), 'UNKNOWN') AS code,
          TRIM(el.error_resolved_by) AS username,
          COUNT(*) AS resolved_count,
          0 AS locked_count
        FROM br7own.error_list el
        WHERE el.error_resolved_by IS NOT NULL
          AND el.error_status = ${ResolutionStatusNumber.Resolved}
          AND el.error_resolved_ts BETWEEN ${startOfDay(filters.fromDate)} AND ${endOfDay(filters.toDate)}
          AND (${organisationUnitSql(database, user)})
        GROUP BY 
          el.error_resolved_ts::DATE,
          COALESCE(SUBSTRING(el.error_report FROM '[A-Z0-9]{8}'), 'UNKNOWN'),
          TRIM(el.error_resolved_by)

        UNION ALL

        SELECT 
          elt.resolved_ts::DATE AS report_date,
          'trigger' AS record_type,
          elt.trigger_code AS code,
          TRIM(elt.resolved_by) AS username,
          COUNT(*) AS resolved_count,
          0 AS locked_count
        FROM br7own.error_list el
        INNER JOIN br7own.error_list_triggers elt ON el.error_id = elt.error_id
        WHERE 
          elt.resolved_by IS NOT NULL
          AND elt.status = ${ResolutionStatusNumber.Resolved}
          AND elt.resolved_ts BETWEEN ${startOfDay(filters.fromDate)} AND ${endOfDay(filters.toDate)}
          AND (${organisationUnitSql(database, user)})
        GROUP BY 
          elt.resolved_ts::DATE,
          elt.trigger_code,
          TRIM(elt.resolved_by)

        UNION ALL

        SELECT 
          ${endOfDay(filters.toDate)}::DATE AS report_date,
          'exception' AS record_type,
          COALESCE(SUBSTRING(el.error_report FROM '[A-Z0-9]{8}'), 'UNKNOWN') AS code,
          TRIM(el.error_locked_by_id) AS username,
          0 AS resolved_count,
          COUNT(*) AS locked_count
        FROM br7own.error_list el
        WHERE 
          el.error_locked_by_id IS NOT NULL
          AND el.error_status = ${ResolutionStatusNumber.Unresolved}
          AND (${organisationUnitSql(database, user)})
        GROUP BY 
          COALESCE(SUBSTRING(el.error_report FROM '[A-Z0-9]{8}'), 'UNKNOWN'),
          TRIM(el.error_locked_by_id)

        UNION ALL

        SELECT 
          ${endOfDay(filters.toDate)}::DATE AS report_date,
          'trigger' AS record_type,
          elt.trigger_code AS code,
          TRIM(el.trigger_locked_by_id) AS username,
          0 AS resolved_count,
          COUNT(*) AS locked_count
        FROM br7own.error_list el
        INNER JOIN br7own.error_list_triggers elt ON el.error_id = elt.error_id
        WHERE 
          el.trigger_locked_by_id IS NOT NULL
          AND elt.status = ${ResolutionStatusNumber.Unresolved}
          AND (${organisationUnitSql(database, user)})
          GROUP BY 
            elt.trigger_code,
            TRIM(el.trigger_locked_by_id)
      ) all_activity
      GROUP BY 
        report_date,
        record_type,
        code,
        username
    ),
        
    user_data AS (
      SELECT 
        a.report_date,
        a.record_type,
        a.code,
        SUM(a.total_resolved) AS code_resolved,
        SUM(a.total_locked) AS code_locked,
        json_agg(
          json_build_object(
            'username', a.username,
            'fullName', TRIM(CONCAT_WS(' ', u.forenames, u.surname)),
            'id', u.id,
            'resolved', a.total_resolved,
            'totalLocked', a.total_locked
          ) ORDER BY a.username
        ) AS users
      FROM aggregated_activity a
      LEFT JOIN br7own.users u ON u.username = a.username
      GROUP BY 
        a.report_date, 
        a.record_type, 
        a.code
    )
    
    SELECT 
      report_date,
      COALESCE(
        json_agg(
          json_build_object(
            'code', code,
            'totals', json_build_object('resolved', code_resolved, 'totalLocked', code_locked),
            'users', users
          ) ORDER BY code
        ) FILTER (WHERE record_type = 'exception'), '[]'::json
      ) AS exceptions,
      COALESCE(
        json_agg(
          json_build_object(
            'code', code,
            'totals', json_build_object('resolved', code_resolved, 'totalLocked', code_locked),
            'users', users
          ) ORDER BY code
        ) FILTER (WHERE record_type = 'trigger'), '[]'::json
      ) AS triggers
    FROM user_data
    GROUP BY report_date
    ORDER BY report_date DESC
  `

  try {
    const cursor = query.cursor(5)

    yield* processUserPerformanceDetail(cursor, filters.fromDate, filters.toDate)
  } catch (err) {
    throw new Error(`Error fetching user detail performance report: ${(err as Error).message}`)
  }
}
