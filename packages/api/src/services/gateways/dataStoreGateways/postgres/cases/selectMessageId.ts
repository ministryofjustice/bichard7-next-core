import type postgres from "postgres"

import type { CaseMessageId } from "../../../../../types/Case"

import { NotFoundError } from "../../../../../types/errors/NotFoundError"
import { UnprocessableEntityError } from "../../../../../types/errors/UnprocessableEntityError"

export default async (
  sql: postgres.Sql,
  caseId: number,
  organisationUnitSql: postgres.PendingQuery<postgres.Row[]>
): Promise<CaseMessageId> => {
  const [result]: [CaseMessageId?] = await sql`
    SELECT el.message_id
    FROM
      br7own.error_list el
    WHERE
      error_id = ${caseId} AND
      (${organisationUnitSql})
    `

  if (!result) {
    throw new NotFoundError("Case not found")
  }

  if (!result.message_id) {
    throw new UnprocessableEntityError("No message id found")
  }

  return result
}
