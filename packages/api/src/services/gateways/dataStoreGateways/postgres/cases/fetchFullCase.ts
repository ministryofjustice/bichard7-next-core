import type { RawCaseData } from "@moj-bichard7/common/types/Case"
import type postgres from "postgres"

export default async (sql: postgres.Sql, caseId: number, forceIds: number[]): Promise<RawCaseData> => {
  const [result]: [RawCaseData?] = await sql`
      SELECT
        el.annotated_msg,
        el.asn,
        el.court_code,
        el.court_date,
        el.court_name,
        el.court_reference,
        el.defendant_name,
        el.error_id,
        el.error_locked_by_id,
        el.error_report,
        el.error_status,
        el.is_urgent,
        el.org_for_police_filter,
        el.phase,
        el.ptiurn,
        el.resolution_ts,
        el.trigger_count,
        el.trigger_locked_by_id,
        el.trigger_status,
        el.updated_msg,
        CONCAT(errorLockU.forenames, ' ', errorLockU.surname) AS error_locked_by_fullname,
        CONCAT(triggerLockU.forenames, ' ', triggerLockU.surname) AS trigger_locked_by_fullname
      FROM
        br7own.error_list AS el
        INNER JOIN br7own.users AS errorLockU ON errorLockU.username = el.error_locked_by_id
        INNER JOIN br7own.users AS triggerLockU ON triggerLockU.username = el.trigger_locked_by_id
      WHERE
        el.error_id = ${caseId} AND
        br7own.force_code(el.org_for_police_filter) = ANY(${forceIds}::SMALLINT[])
    `

  if (!result) {
    throw new Error("Case not found")
  }

  return result
}
