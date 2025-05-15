import type { User } from "@moj-bichard7/common/types/User"

import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"

import type { CaseDataForDto } from "../../../types/Case"
import type { DatabaseConnection } from "../../../types/DatabaseGateway"

import { NotFoundError } from "../../../types/errors/NotFoundError"
import { organisationUnitSql } from "../organisationUnitSql"

export default async (database: DatabaseConnection, user: User, caseId: number): PromiseResult<CaseDataForDto> => {
  const result = await database.connection<CaseDataForDto[]>`
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
        NULLIF(CONCAT_WS(' ', errorLockU.forenames, errorLockU.surname), '') AS error_locked_by_fullname,
        NULLIF(CONCAT_WS(' ', triggerLockU.forenames, triggerLockU.surname), '') AS trigger_locked_by_fullname,
        COALESCE(
          json_agg(
            DISTINCT to_jsonb(eln.*) ||
            jsonb_build_object(
              'user',
              jsonb_build_object(
                'forenames', eln_users.forenames,
                'username', eln_users.username,
                'surname', eln_users.surname,
                'visible_forces', eln_users.visible_forces
              )
            )
          ) FILTER (WHERE eln.note_id IS NOT NULL), '[]'
        ) AS notes,
        COALESCE(json_agg(DISTINCT to_jsonb(elt.*)) FILTER (WHERE elt.trigger_id IS NOT NULL), '[]') AS triggers
      FROM
        br7own.error_list AS el
        LEFT JOIN br7own.error_list_notes AS eln ON eln.error_id = el.error_id
        LEFT JOIN br7own.error_list_triggers AS elt ON elt.error_id = el.error_id
        LEFT JOIN br7own.users AS eln_users ON eln.user_id = eln_users.username
        LEFT JOIN br7own.users AS errorLockU ON errorLockU.username = el.error_locked_by_id
        LEFT JOIN br7own.users AS triggerLockU ON triggerLockU.username = el.trigger_locked_by_id
      WHERE
        el.error_id = ${caseId} AND
        (${organisationUnitSql(database, user)})
      GROUP BY el.error_id, errorLockU.forenames, errorLockU.surname, triggerLockU.forenames, triggerLockU.surname
    `.catch((error: Error) => error)

  if (isError(result)) {
    return Error(`Couldn't fetch case id ${caseId} for user ${user.username}: ${result.message}`)
  }

  if (!result || result.length === 0) {
    throw new NotFoundError(`Case id ${caseId} for user ${user.username} not found`)
  }

  return result[0]
}
