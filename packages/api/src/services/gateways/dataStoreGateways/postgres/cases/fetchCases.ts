import type postgres from "postgres"

import type { CaseDataForIndexDto, Pagination } from "../../../../../types/Case"

import { ResolutionStatus, resolutionStatusCodeByText } from "../../../../../useCases/dto/convertResolutionStatus"

export default async (
  sql: postgres.Sql,
  forceIds: number[],
  pagination: Pagination
): Promise<CaseDataForIndexDto[]> => {
  const offset = (pagination.pageNum - 1) * pagination.maxPerPage
  const resolutionStatus = resolutionStatusCodeByText(ResolutionStatus.Unresolved) ?? 1

  // TODO: Filter triggers here
  const triggerFiltersSql = sql`
    AND (elt.trigger_code NOT IN('') AND elt.status = ${resolutionStatus})
  `

  // TODO: Other filtering goes here
  const filtersSql = sql`
    -- This makes it fast
    AND (el.error_status = ${resolutionStatus} OR el.trigger_status = ${resolutionStatus})
    AND (el.trigger_status = ${resolutionStatus} OR el.error_status = ${resolutionStatus})
    -- End of fast
    AND el.resolution_ts IS NULL
  `

  //TODO: Ordering goes here
  const orderSql = sql`
    el_court_date DESC,
    el_ptiurn ASC
  `

  const allCasesSql = sql`
    SELECT DISTINCT
      distinctAlias.el_error_id AS ids_el_error_id,
      distinctAlias.el_court_date,
      distinctAlias.el_ptiurn,
      distinctAlias.el_error_locked_by_id,
      distinctAlias.el_trigger_locked_by_id
    FROM
      (
        SELECT
          el.error_id AS el_error_id,
          el.court_date AS el_court_date,
          el.ptiurn AS el_ptiurn,
          el.error_locked_by_id AS el_error_locked_by_id,
          el.trigger_locked_by_id AS el_trigger_locked_by_id
        FROM
          br7own.error_list el
          LEFT JOIN br7own.error_list_triggers elt ON elt.error_id = el.error_id
            ${triggerFiltersSql}
        WHERE
          (br7own.force_code (org_for_police_filter) = ANY (${forceIds}))
          ${filtersSql}
      ) distinctAlias
  `

  const limitedCasesSql = sql`
    SELECT
      ids_el_error_id,
      el_error_locked_by_id,
      el_trigger_locked_by_id
    FROM
      allCases
    ORDER BY
      ${orderSql}
    LIMIT ${pagination.maxPerPage}
    OFFSET ${offset}
  `

  const usersSql = sql`
    SELECT DISTINCT
      (userId) AS username
    FROM
      (
        SELECT
          el_error_locked_by_id AS userId
        FROM
          limitedCases
        UNION
        SELECT
          el_trigger_locked_by_id AS userId
        FROM
          limitedCases
      ) AS unionQuery
  `

  const valuesSql = sql`
    SELECT
      el.error_id,
      el.asn,
      el.court_date AS el_court_date,
      el.court_date,
      el.court_name,
      el.defendant_name,
      el.error_locked_by_id,
      el.error_report,
      el.error_status,
      el.ptiurn AS el_ptiurn,
      el.ptiurn,
      el.resolution_ts,
      el.trigger_count,
      el.trigger_locked_by_id,
      el.trigger_status,
      COUNT(CASE WHEN eln.user_id != 'System' OR eln.user_id IS NULL THEN eln.note_id END) AS note_count,
      NULLIF(CONCAT_WS(' ', errorLockedByUser.forenames, errorLockedByUser.surname), '') AS error_locked_by_fullname,
      NULLIF(CONCAT_WS(' ', triggerLockedByUser.forenames, triggerLockedByUser.surname), '') AS trigger_locked_by_fullname,
      (SELECT fullCount FROM totalCount) AS full_count
    FROM
      br7own.error_list el
      LEFT JOIN relevantUsers errorLockedByUser ON errorLockedByUser.username = el.error_locked_by_id
      LEFT JOIN relevantUsers triggerLockedByUser ON triggerLockedByUser.username = el.trigger_locked_by_id
      LEFT JOIN br7own.error_list_notes AS eln ON eln.error_id = el.error_id
    WHERE
      (el.error_id IN (SELECT ids_el_error_id FROM limitedCases))
    GROUP BY
      el.error_id,
      el.asn,
      el.court_date,
      el.court_name,
      el.defendant_name,
      el.error_locked_by_id,
      el.error_report,
      el.error_status,
      el.ptiurn,
      el.resolution_ts,
      el.trigger_count,
      el.trigger_locked_by_id,
      el.trigger_status,
      errorLockedByUser.forenames,
      errorLockedByUser.surname,
      triggerLockedByUser.forenames,
      triggerLockedByUser.surname
    ORDER BY
      ${orderSql}
  `

  const result: CaseDataForIndexDto[] = await sql`
    WITH
      allCases AS (
        ${allCasesSql}
      ),
      limitedCases AS (
        ${limitedCasesSql}
      ),
      userIds AS (
        ${usersSql}
      ),
      totalCount AS (
        SELECT
          COUNT(*) AS fullCount
        FROM
          allCases
      ),
      relevantUsers AS (
        SELECT
          username,
          forenames,
          surname
        FROM
          br7own.users
        WHERE
          username IN (SELECT username FROM userIds)
      )
    ${valuesSql}
  `

  return result
}
