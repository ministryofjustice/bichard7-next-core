import type { AuditCasesQuery } from "@moj-bichard7/common/contracts/AuditCasesQuery"
import type { User } from "@moj-bichard7/common/types/User"

import Permission from "@moj-bichard7/common/types/Permission"
import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"
import { userAccess } from "@moj-bichard7/common/utils/userPermissions"

import type { WritableDatabaseConnection } from "../../types/DatabaseGateway"

import { getAudit } from "../../services/db/audit/getAudit"
import { NotAllowedError } from "../../types/errors/NotAllowedError"
import { NotFoundError } from "../../types/errors/NotFoundError"

export async function getAuditCases(
  database: WritableDatabaseConnection,
  auditId: number,
  auditCasesQuery: AuditCasesQuery,
  user: User
): PromiseResult<void> {
  if (!userAccess(user)[Permission.CanAuditCases]) {
    return new NotAllowedError()
  }

  return await database
    .transaction<Error | void>(async (tx) => {
      const auditResult = await getAudit(tx, auditId, user)
      if (isError(auditResult)) {
        throw auditResult
      }

      if (!auditResult) {
        throw new NotFoundError()
      }
    })
    .catch((err) => err)
}
