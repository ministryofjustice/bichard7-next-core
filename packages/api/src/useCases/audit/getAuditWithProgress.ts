import type { AuditWithProgressDto } from "@moj-bichard7/common/types/Audit"
import type { User } from "@moj-bichard7/common/types/User"

import Permission from "@moj-bichard7/common/types/Permission"
import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"
import { userAccess } from "@moj-bichard7/common/utils/userPermissions"

import type { WritableDatabaseConnection } from "../../types/DatabaseGateway"

import { fetchAudit } from "../../services/db/audit/fetchAudit"
import { NotAllowedError } from "../../types/errors/NotAllowedError"
import { NotFoundError } from "../../types/errors/NotFoundError"

export async function getAuditWithProgress(
  database: WritableDatabaseConnection,
  auditId: number,
  user: User
): PromiseResult<AuditWithProgressDto> {
  if (!userAccess(user)[Permission.CanAuditCases]) {
    return new NotAllowedError()
  }

  return await database
    .transaction<Error | void>(async (tx) => {
      const audit = await fetchAudit(tx, auditId, user)
      if (isError(audit)) {
        throw audit
      }

      if (!audit) {
        throw new NotFoundError()
      }
    })
    .catch((err) => err)
}
