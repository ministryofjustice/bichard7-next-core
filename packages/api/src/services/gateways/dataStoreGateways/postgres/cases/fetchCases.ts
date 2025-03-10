import type { User } from "@moj-bichard7/common/types/User"
import type postgres from "postgres"

import { isEmpty } from "lodash"

import type { CaseDataForIndexDto } from "../../../../../types/Case"
import type { Filters, Pagination, SortOrder } from "../../../../../types/CaseIndexQuerystring"

import { excludedTriggersAndStatusSql } from "./filters/excludedTriggersAndStatusSql"
import { generateFilters } from "./filters/generateFilters"
import { ordering } from "./filters/ordering"

export default async (
  sql: postgres.Sql,
  forceIds: number[],
  user: User,
  pagination: Pagination,
  sortOrder: SortOrder,
  filters: Filters
): Promise<CaseDataForIndexDto[]> => {
  const offset = (pagination.pageNum - 1) * pagination.maxPerPage
  const visibleCourts = user.visible_courts?.split(",").filter((vc) => !isEmpty(vc))

  let visibleCourtsSql = sql`FALSE`

  if (visibleCourts && visibleCourts.length > 0) {
    const regex = `(${visibleCourts.map((vc) => vc + "*").join("|")})`
    visibleCourtsSql = sql`el.court_code ~* ${regex}`
  }

  // TODO: Other filtering goes here
  const filtersSql = generateFilters(sql, user, filters)

  const allCasesSql = sql`
    SELECT DISTINCT
      distinctAlias.el_error_id AS ids_el_error_id,
      distinctAlias.el_court_date,
      distinctAlias.el_court_name,
      distinctAlias.el_ptiurn,
      distinctAlias.el_error_locked_by_id,
      distinctAlias.el_trigger_locked_by_id,
      distinctAlias.el_defendant_name
    FROM
      (
        SELECT
          el.error_id AS el_error_id,
          el.court_date AS el_court_date,
          el.court_name AS el_court_name,
          el.ptiurn AS el_ptiurn,
          el.error_locked_by_id AS el_error_locked_by_id,
          el.trigger_locked_by_id AS el_trigger_locked_by_id,
          el.defendant_name AS el_defendant_name
        FROM
          br7own.error_list el
          LEFT JOIN br7own.error_list_triggers elt ON elt.error_id = el.error_id
            ${excludedTriggersAndStatusSql(sql, filters, user)}
        WHERE
          (${visibleCourtsSql} OR br7own.force_code (org_for_police_filter) = ANY (${forceIds}))
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
      ${ordering(sql, sortOrder)}
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
      el.court_name AS el_court_name,
      el.court_name,
      el.defendant_name AS el_defendant_name,
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
      ${ordering(sql, sortOrder)}
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
