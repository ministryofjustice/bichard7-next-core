import type { AuditCasesQuery } from "@moj-bichard7/common/contracts/AuditCasesQuery"
import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User } from "@moj-bichard7/common/types/User"

import Permission from "@moj-bichard7/common/types/Permission"
import { userAccess } from "@moj-bichard7/common/utils/userPermissions"

import type { WritableDatabaseConnection } from "../../types/DatabaseGateway"

import { NotAllowedError } from "../../types/errors/NotAllowedError"

export async function getAuditCases(
  database: WritableDatabaseConnection,
  auditCasesQuery: AuditCasesQuery,
  user: User
): PromiseResult<void> {
  if (!userAccess(user)[Permission.CanAuditCases]) {
    return new NotAllowedError()
  }

  return await database.transaction<Error | void>(async (tx) => {}).catch((err) => err)
}
