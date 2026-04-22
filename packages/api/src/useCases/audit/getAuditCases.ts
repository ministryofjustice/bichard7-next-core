import type { AuditCasesQuery } from "@moj-bichard7/common/contracts/AuditCasesQuery"
import type { AuditCasesMetadata } from "@moj-bichard7/common/types/AuditCase"
import type { User } from "@moj-bichard7/common/types/User"

import Permission from "@moj-bichard7/common/types/Permission"
import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"
import { userAccess } from "@moj-bichard7/common/utils/userPermissions"

import type { WritableDatabaseConnection } from "../../types/DatabaseGateway"

import { fetchAudit } from "../../services/db/audit/fetchAudit"
import { fetchAuditCases } from "../../services/db/audit/fetchAuditCases"
import { NotAllowedError } from "../../types/errors/NotAllowedError"
import { NotFoundError } from "../../types/errors/NotFoundError"

export async function getAuditCases(
  database: WritableDatabaseConnection,
  auditId: number,
  auditCasesQuery: AuditCasesQuery,
  user: User
): PromiseResult<AuditCasesMetadata> {
  if (!userAccess(user)[Permission.CanAuditCases]) {
    return new NotAllowedError()
  }

  return await database
    .transaction<AuditCasesMetadata | Error>(async (tx) => {
      const audit = await fetchAudit(tx, auditId, user)
      if (isError(audit)) {
        throw audit
      }

      if (!audit) {
        throw new NotFoundError()
      }

      const auditCases = await fetchAuditCases(tx, auditId, auditCasesQuery, user)
      if (isError(auditCases)) {
        throw auditCases
      }

      return auditCases
    })
    .catch((err) => err)
}
