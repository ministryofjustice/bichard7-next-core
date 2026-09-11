import type { PromiseResult } from "@moj-bichard7/common/types/Result"

import { isError } from "@moj-bichard7/common/types/Result"

import type { TransactionConnection } from "../../../types/DatabaseGateway"

import { NotFoundError } from "../../../types/errors/NotFoundError"

export default async function unlockException(database: TransactionConnection, caseId: number): PromiseResult<void> {
  const result = await database.connection`
    UPDATE br7own.error_list el
      SET
        error_locked_by_id = NULL
      WHERE
        error_id = ${caseId} 
    `.catch((error: Error) => error)

  if (isError(result)) {
    return new Error(`Couldn't unlock exceptions for case id ${caseId}: ${result.message}`)
  }

  if (result.count === 0) {
    return new NotFoundError()
  }
}
