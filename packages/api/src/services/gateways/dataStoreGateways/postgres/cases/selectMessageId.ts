import type postgres from "postgres"

import type { CaseMessageId } from "../../../../../types/Case"

import { NotFoundError } from "../../../../../types/errors/NotFoundError"
import { UnprocessableEntityError } from "../../../../../types/errors/UnprocessableEntityError"

export default async (sql: postgres.Sql, caseId: number, forceIds: number[]): Promise<CaseMessageId> => {
  const [result]: [CaseMessageId?] = await sql`
    SELECT el.message_id
    FROM
      br7own.error_list el
    WHERE
      error_id = ${caseId} AND
      br7own.force_code(el.org_for_police_filter) = ANY(${forceIds}::SMALLINT[])
    `

  if (!result) {
    throw new NotFoundError("Case not found")
  }

  if (!result.message_id) {
    throw new UnprocessableEntityError("No message id found")
  }

  return result
}
