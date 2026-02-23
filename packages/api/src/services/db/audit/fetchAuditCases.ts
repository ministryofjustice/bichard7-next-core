import type { AuditCasesQuery } from "@moj-bichard7/common/contracts/AuditCasesQuery"
import type { AuditCase, AuditCasesMetadata } from "@moj-bichard7/common/types/AuditCase"
import type { User } from "@moj-bichard7/common/types/User"

import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"

import type { DatabaseConnection } from "../../../types/DatabaseGateway"

import { convertAuditCaseToDto } from "../../../useCases/dto/convertAuditCaseToDto"
import { organisationUnitSql } from "../organisationUnitSql"

export const fetchAuditCases = async (
  database: DatabaseConnection,
  auditId: number,
  { maxPerPage, order, orderBy, pageNum }: AuditCasesQuery,
  user: User
): PromiseResult<AuditCasesMetadata> => {
  const sql = database.connection

  const results = await sql<AuditCase[]>`
    SELECT
      ac.audit_case_id,
      ac.audit_id,
      el.error_id,
      el.asn,
      el.court_date,
      el.court_name,
      el.defendant_name,
      el.error_quality_checked,
      el.msg_received_ts,
      el.ptiurn,
      el.resolution_ts,
      el.trigger_quality_checked,
      el.trigger_status,
      (
        SELECT COUNT(*)
        FROM br7own.error_list_notes n_count
        WHERE n_count.error_id = el.error_id
          AND (n_count.user_id != 'System' OR n_count.user_id IS NULL)
      ) AS note_count,
      COALESCE(
        (
          SELECT json_build_array(
             json_build_object(
               'note_id', n_latest.note_id,
               'error_id', n_latest.error_id,
               'note_text', n_latest.note_text,
               'user_id', n_latest.user_id,
               'create_ts', n_latest.create_ts
             )
           )
          FROM br7own.error_list_notes n_latest
          WHERE
            n_latest.error_id = el.error_id
            AND (n_latest.user_id != 'System' OR n_latest.user_id IS NULL)
          ORDER BY
            n_latest.create_ts DESC
          LIMIT 1
        ),
        '[]'::json
      ) AS notes
    FROM 
      br7own.audit_cases AS ac
      INNER JOIN br7own.error_list AS el ON el.error_id = ac.error_id
    WHERE
      ac.audit_id = ${auditId}
      AND (${organisationUnitSql(database, user)})
  `.catch((error: Error) => error)
  if (isError(results)) {
    return new Error("Failed to get audit case records")
  }

  const summary = await sql<{ count: number }[]>`
    SELECT
      COUNT(*) AS count
    FROM 
      br7own.audit_cases AS ac
      INNER JOIN br7own.error_list AS el ON el.error_id = ac.error_id
    WHERE
      ac.audit_id = ${auditId}
      AND (${organisationUnitSql(database, user)})
  `.catch((error: Error) => error)
  if (isError(summary)) {
    return new Error("Failed to get count of audit case records")
  }

  return {
    cases: results.map((row) => convertAuditCaseToDto(row)),
    maxPerPage,
    pageNum,
    returnCases: results.length,
    totalCases: Number(summary[0].count)
  }
}
