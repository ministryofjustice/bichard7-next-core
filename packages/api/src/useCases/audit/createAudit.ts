import type { CreateAudit } from "@moj-bichard7/common/contracts/CreateAudit"
import type { AuditDto } from "@moj-bichard7/common/types/Audit"
import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User } from "@moj-bichard7/common/types/User"

import Permission from "@moj-bichard7/common/types/Permission"
import { isError } from "@moj-bichard7/common/types/Result"
import { userAccess } from "@moj-bichard7/common/utils/userPermissions"

import type { WritableDatabaseConnection } from "../../types/DatabaseGateway"

import { getPotentialCasesToAudit } from "../../services/db/audit/getPotentialCasesToAudit"
import { insertAudit } from "../../services/db/audit/insertAudit"
import { NotAllowedError } from "../../types/errors/NotAllowedError"

export async function createAudit(
  database: WritableDatabaseConnection,
  createAudit: CreateAudit,
  user: User
): PromiseResult<AuditDto> {
  if (!userAccess(user)[Permission.CanAuditCases]) {
    return new NotAllowedError()
  }

  return await database.transaction<AuditDto | Error>(async (tx) => {
    const auditResult = await insertAudit(tx, createAudit, user)
    if (isError(auditResult)) {
      throw auditResult
    }

    const potentialCasesToAudit = await getPotentialCasesToAudit(tx, createAudit, user)
    if (isError(potentialCasesToAudit)) {
      throw potentialCasesToAudit
    }

    return auditResult
  })
}
