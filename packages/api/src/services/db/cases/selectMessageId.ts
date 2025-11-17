import type { User } from "@moj-bichard7/common/types/User"

import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"

import type { CaseMessageId } from "../../../types/Case"
import type { DatabaseConnection } from "../../../types/DatabaseGateway"

import { NotFoundError } from "../../../types/errors/NotFoundError"
import { organisationUnitSql } from "../organisationUnitSql"

export default async (database: DatabaseConnection, user: User, caseId: number): PromiseResult<string> => {
  const result = await database.connection<CaseMessageId[]>`
    SELECT el.message_id
    FROM
      br7own.error_list el
    WHERE
      error_id = ${caseId} AND
      (${organisationUnitSql(database, user)})
    `.catch((error: Error) => error)

  if (isError(result)) {
    return new Error(
      `Error while selecting message id for case id ${caseId} and user ${user.username}: ${result.message}`
    )
  }

  if (!result || result.length === 0) {
    return new NotFoundError(`Case not found for Case id ${caseId} and user ${user.username}`)
  }

  return result[0].message_id
}
